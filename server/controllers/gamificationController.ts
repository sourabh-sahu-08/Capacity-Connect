// @ts-nocheck
import { Request, Response } from 'express';
import prisma from '../config/prisma';

interface CalculatedUserXP {
  id: string;
  name: string;
  avatar: string | null;
  role: string;
  currentRole: string | null;
  organization: string | null;
  location: string | null;
  competencyScore: number;
  readinessScore: number;
  streakDays: number;
  projectsCount: number;
  featuredProjectsCount: number;
  endorsementsCount: number;
  recommendationsCount: number;
  totalXP: number;
  level: number;
  badgesCount: number;
}

const computeUserStats = (user: any): CalculatedUserXP => {
  const overallScore = user.competencyProfile?.overallScore || 0;
  const readinessScore = user.competencyProfile?.readinessScore || 0;
  const evidencesCount = user._count?.competencyEvidences || 0;
  const projects = user.projects || [];
  const projectsCount = projects.length;
  const featuredProjectsCount = projects.filter((p: any) => p.featured).length;
  const endorsementsCount = user._count?.endorsementsReceived || 0;
  const recommendationsCount = user._count?.sentRecommendations || 0;

  // Streak estimation based on creation date & activity
  const daysSinceCreated = Math.max(
    1,
    Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))
  );
  const streakDays = Math.min(daysSinceCreated, 14);

  // Dynamic XP Formula
  const baseXP = 150;
  const competencyXP = Math.round(overallScore * 25);
  const readinessXP = Math.round(readinessScore * 15);
  const evidencesXP = evidencesCount * 50;
  const projectsXP = projectsCount * 120 + featuredProjectsCount * 80;
  const endorsementsXP = endorsementsCount * 35;
  const recommendationsXP = recommendationsCount * 40;
  const streakBonus = streakDays * 15;

  const totalXP =
    baseXP +
    competencyXP +
    readinessXP +
    evidencesXP +
    projectsXP +
    endorsementsXP +
    recommendationsXP +
    streakBonus;

  const level = Math.floor(Math.sqrt(totalXP / 75)) + 1;

  // Badges calculation
  let badgesCount = 1; // Welcome badge
  if (projectsCount >= 1) badgesCount++;
  if (endorsementsCount >= 2) badgesCount++;
  if (overallScore >= 75) badgesCount++;
  if (level >= 5) badgesCount++;
  if (recommendationsCount >= 1) badgesCount++;

  return {
    id: user.id,
    name: user.name,
    avatar: user.avatar,
    role: user.role,
    currentRole: user.currentRole,
    organization: user.organization,
    location: user.location,
    competencyScore: Math.round(overallScore),
    readinessScore: Math.round(readinessScore),
    streakDays,
    projectsCount,
    featuredProjectsCount,
    endorsementsCount,
    recommendationsCount,
    totalXP,
    level,
    badgesCount,
  };
};

// 1. Get Leaderboard
export const getLeaderboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUserId = (req as any).user?.id;
    const { scope = 'global', category = 'xp', limit = 50 } = req.query;

    const currentUser = currentUserId
      ? await prisma.user.findUnique({
          where: { id: currentUserId },
          select: { id: true, organization: true },
        })
      : null;

    // Fetch users with relations
    const whereClause: any = {};
    if (scope === 'organization' && currentUser?.organization) {
      whereClause.organization = currentUser.organization;
    }

    const rawUsers = await prisma.user.findMany({
      where: whereClause,
      include: {
        competencyProfile: {
          select: { overallScore: true, readinessScore: true },
        },
        projects: {
          select: { id: true, featured: true },
        },
        _count: {
          select: {
            competencyEvidences: true,
            endorsementsReceived: true,
            sentRecommendations: true,
          },
        },
      },
    });

    // Compute stats for each user
    let userStatsList = rawUsers.map(computeUserStats);

    // Sort according to category
    if (category === 'competency') {
      userStatsList.sort((a, b) => b.competencyScore - a.competencyScore || b.totalXP - a.totalXP);
    } else if (category === 'streak') {
      userStatsList.sort((a, b) => b.streakDays - a.streakDays || b.totalXP - a.totalXP);
    } else {
      userStatsList.sort((a, b) => b.totalXP - a.totalXP);
    }

    // Attach rank
    const rankedUsers = userStatsList.map((user, index) => ({
      ...user,
      rank: index + 1,
    }));

    // Find current user's rank
    let currentUserRankData = null;
    if (currentUserId) {
      const userRankIndex = rankedUsers.findIndex((u) => u.id === currentUserId);
      if (userRankIndex !== -1) {
        const userEntry = rankedUsers[userRankIndex];
        const aheadEntry = userRankIndex > 0 ? rankedUsers[userRankIndex - 1] : null;
        const xpToNextRank = aheadEntry ? Math.max(10, aheadEntry.totalXP - userEntry.totalXP + 10) : 0;

        currentUserRankData = {
          ...userEntry,
          rank: userRankIndex + 1,
          xpToNextRank,
          nextRankUserName: aheadEntry ? aheadEntry.name : null,
        };
      }
    }

    const limitedRankedUsers = rankedUsers.slice(0, Number(limit) || 50);

    // Summary stats
    const totalParticipants = rankedUsers.length;
    const avgLevel =
      totalParticipants > 0
        ? Math.round(rankedUsers.reduce((acc, u) => acc + u.level, 0) / totalParticipants)
        : 1;

    res.json({
      success: true,
      scope,
      category,
      totalParticipants,
      avgLevel,
      leaderboard: limitedRankedUsers,
      currentUserRank: currentUserRankData,
    });
  } catch (error) {
    console.error('Get Leaderboard Error:', error);
    res.status(500).json({ message: 'Failed to fetch leaderboard rankings' });
  }
};

// 2. Get User Gamification Profile & Weekly Quests
export const getUserGamificationProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        competencyProfile: true,
        projects: true,
        following: true,
        followers: true,
        _count: {
          select: {
            competencyEvidences: true,
            endorsementsReceived: true,
            sentRecommendations: true,
            projects: true,
            following: true,
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const stats = computeUserStats(user);

    // Level progress calculations
    const currentLevelBaseXP = Math.pow(stats.level - 1, 2) * 75;
    const nextLevelBaseXP = Math.pow(stats.level, 2) * 75;
    const levelRange = Math.max(1, nextLevelBaseXP - currentLevelBaseXP);
    const xpIntoLevel = Math.max(0, stats.totalXP - currentLevelBaseXP);
    const levelProgressPercent = Math.min(100, Math.round((xpIntoLevel / levelRange) * 100));

    // Weekly Quests (evaluated dynamically)
    const quests = [
      {
        id: 'quest-project',
        title: 'Project Architect',
        description: 'Publish at least 1 production or open-source project to your portfolio',
        icon: 'FolderGit2',
        xpReward: 150,
        currentProgress: Math.min(stats.projectsCount, 1),
        maxProgress: 1,
        completed: stats.projectsCount >= 1,
        category: 'Portfolio',
      },
      {
        id: 'quest-endorsements',
        title: 'Peer Validation',
        description: 'Earn 2 skill endorsements from collaborators or trainers',
        icon: 'Award',
        xpReward: 100,
        currentProgress: Math.min(stats.endorsementsCount, 2),
        maxProgress: 2,
        completed: stats.endorsementsCount >= 2,
        category: 'Network',
      },
      {
        id: 'quest-recommendation',
        title: 'Community Catalyst',
        description: 'Write a verified testimonial or peer recommendation for a colleague',
        icon: 'Quote',
        xpReward: 90,
        currentProgress: Math.min(stats.recommendationsCount, 1),
        maxProgress: 1,
        completed: stats.recommendationsCount >= 1,
        category: 'Collaboration',
      },
      {
        id: 'quest-competency',
        title: 'Competency Milestone',
        description: 'Attain at least 70% Overall Score in your Competency DNA',
        icon: 'Brain',
        xpReward: 200,
        currentProgress: Math.min(stats.competencyScore, 70),
        maxProgress: 70,
        completed: stats.competencyScore >= 70,
        category: 'Capability',
      },
      {
        id: 'quest-network',
        title: 'Network Builder',
        description: 'Connect with and follow 3 peers or mentors in the Discover Hub',
        icon: 'Users',
        xpReward: 80,
        currentProgress: Math.min(user._count?.following || 0, 3),
        maxProgress: 3,
        completed: (user._count?.following || 0) >= 3,
        category: 'Network',
      },
    ];

    // Badges list with unlock status
    const badges = [
      {
        id: 'badge-explorer',
        title: 'Capacity Pioneer',
        category: 'Milestone',
        description: 'Joined Capacity-Connect and initialized developer profile',
        tier: 'COMMON',
        unlocked: true,
        unlockedAt: user.createdAt,
        icon: 'Compass',
      },
      {
        id: 'badge-project',
        title: 'Code Architect',
        category: 'Portfolio',
        description: 'Published a live engineering artifact with source repository',
        tier: 'RARE',
        unlocked: stats.projectsCount >= 1,
        unlockedAt: stats.projectsCount >= 1 ? user.updatedAt : null,
        icon: 'FolderGit2',
      },
      {
        id: 'badge-endorse',
        title: 'Skill Master',
        category: 'Recognition',
        description: 'Received 2 or more peer endorsements on core capabilities',
        tier: 'RARE',
        unlocked: stats.endorsementsCount >= 2,
        unlockedAt: stats.endorsementsCount >= 2 ? user.updatedAt : null,
        icon: 'ShieldCheck',
      },
      {
        id: 'badge-dna',
        title: 'DNA Mastery',
        category: 'Competency',
        description: 'Demonstrated high capability rating (>75%) across competency dimensions',
        tier: 'EPIC',
        unlocked: stats.competencyScore >= 75,
        unlockedAt: stats.competencyScore >= 75 ? user.updatedAt : null,
        icon: 'Brain',
      },
      {
        id: 'badge-level5',
        title: 'Level 5 Veteran',
        category: 'Progression',
        description: 'Advanced to Level 5 through continuous verified learning & builds',
        tier: 'EPIC',
        unlocked: stats.level >= 5,
        unlockedAt: stats.level >= 5 ? user.updatedAt : null,
        icon: 'Sparkles',
      },
      {
        id: 'badge-vouch',
        title: 'Trusted Peer',
        category: 'Collaboration',
        description: 'Authored an endorsed recommendation vouching for another developer',
        tier: 'LEGENDARY',
        unlocked: stats.recommendationsCount >= 1,
        unlockedAt: stats.recommendationsCount >= 1 ? user.updatedAt : null,
        icon: 'Quote',
      },
    ];

    res.json({
      success: true,
      stats: {
        ...stats,
        currentLevelBaseXP,
        nextLevelBaseXP,
        levelProgressPercent,
        xpToNextLevel: Math.max(0, nextLevelBaseXP - stats.totalXP),
      },
      quests,
      badges,
    });
  } catch (error) {
    console.error('Get Gamification Profile Error:', error);
    res.status(500).json({ message: 'Failed to fetch gamification profile' });
  }
};
