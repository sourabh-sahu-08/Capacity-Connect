import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const learners = await prisma.user.findMany({
      where: { role: 'LEARNER' },
      include: {
        competencyProfile: true
      }
    });

    const leaderboard = learners.map(l => {
      const competencyScore = l.competencyProfile?.overallScore || 0;
      const readinessScore = l.competencyProfile?.readinessScore || 0;
      const totalXP = Math.round(competencyScore * 100);
      return {
        id: l.id,
        name: l.name,
        avatar: l.avatar,
        role: l.role,
        currentRole: l.currentRole,
        organization: l.organization,
        location: null,
        competencyScore,
        readinessScore,
        streakDays: Math.floor(competencyScore / 10),
        projectsCount: Math.floor(readinessScore / 20),
        featuredProjectsCount: 0,
        endorsementsCount: 0,
        recommendationsCount: 0,
        totalXP,
        level: Math.floor(totalXP / 1000) + 1,
        badgesCount: 0,
        rank: 0
      };
    }).sort((a, b) => b.totalXP - a.totalXP);

    leaderboard.forEach((entry, i) => {
      entry.rank = i + 1;
    });

    res.json({
      success: true,
      scope: 'global',
      category: 'xp',
      totalParticipants: leaderboard.length,
      avgLevel: leaderboard.length ? Math.round(leaderboard.reduce((s, c) => s + c.level, 0) / leaderboard.length) : 0,
      leaderboard: leaderboard.slice(0, 10),
      currentUserRank: null // simple mock
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getGamificationProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { competencyProfile: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const competencyScore = user.competencyProfile?.overallScore || 0;
    const readinessScore = user.competencyProfile?.readinessScore || 0;
    const totalXP = Math.round(competencyScore * 100);
    const level = Math.floor(totalXP / 1000) + 1;
    const currentLevelBaseXP = (level - 1) * 1000;
    const nextLevelBaseXP = level * 1000;

    res.json({
      success: true,
      stats: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        currentRole: user.currentRole,
        organization: user.organization,
        competencyScore,
        readinessScore,
        streakDays: Math.floor(competencyScore / 10),
        projectsCount: Math.floor(readinessScore / 20),
        featuredProjectsCount: 0,
        endorsementsCount: 0,
        recommendationsCount: 0,
        totalXP,
        level,
        badgesCount: 0,
        currentLevelBaseXP,
        nextLevelBaseXP,
        levelProgressPercent: ((totalXP - currentLevelBaseXP) / 1000) * 100,
        xpToNextLevel: nextLevelBaseXP - totalXP
      },
      quests: [
        { id: '1', title: 'Complete a Course', description: 'Finish any enrolled course', icon: 'Award', xpReward: 500, currentProgress: 0, maxProgress: 1, completed: false, category: 'learning' },
        { id: '2', title: 'Take Assessment', description: 'Pass your first skill assessment', icon: 'Target', xpReward: 1000, currentProgress: 0, maxProgress: 1, completed: false, category: 'testing' }
      ],
      badges: []
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
