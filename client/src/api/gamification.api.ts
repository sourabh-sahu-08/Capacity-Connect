import api from './axios';

export interface LeaderboardEntry {
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
  rank: number;
}

export interface CurrentUserRankInfo extends LeaderboardEntry {
  xpToNextRank: number;
  nextRankUserName: string | null;
}

export interface LeaderboardResponse {
  success: boolean;
  scope: 'global' | 'organization';
  category: 'xp' | 'competency' | 'streak';
  totalParticipants: number;
  avgLevel: number;
  leaderboard: LeaderboardEntry[];
  currentUserRank: CurrentUserRankInfo | null;
}

export interface WeeklyQuest {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  currentProgress: number;
  maxProgress: number;
  completed: boolean;
  category: string;
}

export interface GamificationBadge {
  id: string;
  title: string;
  category: string;
  description: string;
  tier: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  unlocked: boolean;
  unlockedAt: string | null;
  icon: string;
}

export interface GamificationProfileResponse {
  success: boolean;
  stats: {
    id: string;
    name: string;
    avatar: string | null;
    role: string;
    currentRole: string | null;
    organization: string | null;
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
    currentLevelBaseXP: number;
    nextLevelBaseXP: number;
    levelProgressPercent: number;
    xpToNextLevel: number;
  };
  quests: WeeklyQuest[];
  badges: GamificationBadge[];
}

export const gamificationApi = {
  getLeaderboard: (params?: { scope?: 'global' | 'organization'; category?: 'xp' | 'competency' | 'streak'; limit?: number }) =>
    api.get<LeaderboardResponse>('/api/gamification/leaderboard', { params }),

  getGamificationProfile: () =>
    api.get<GamificationProfileResponse>('/api/gamification/me'),
};
