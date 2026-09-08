import api from './axios';

export interface UserSocials {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
}

export interface SkillEndorsementInfo {
  count: number;
  hasEndorsed: boolean;
  endorsers: Array<{
    id: string;
    name: string;
    avatar?: string;
    role: string;
    currentRole?: string;
  }>;
}

export interface PublicUserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  bio?: string;
  organization?: string;
  currentRole?: string;
  targetRole?: string;
  learningGoal?: string;
  experienceLevel?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  websiteUrl?: string;
  location?: string;
  skillsList?: string[];
  createdAt: string;
  endorsements?: Record<string, SkillEndorsementInfo>;
  competencyProfile?: {
    overallScore: number;
    readinessScore: number;
    dnaTechnical: number;
    dnaAnalytical: number;
    dnaCommunication: number;
    dnaLeadership: number;
    dnaCreativity: number;
    skills?: Array<{
      score: number;
      confidence: number;
      evidenceCount: number;
      skill: {
        id: string;
        name: string;
        category: string;
      };
    }>;
  };
  courses?: Array<{
    id: string;
    title: string;
    description: string;
    status: string;
    targetCompetencies: string[];
    createdAt: string;
  }>;
  projects?: UserProject[];
}

export interface UserProject {
  id: string;
  userId: string;
  title: string;
  description: string;
  tags: string[];
  githubUrl?: string;
  demoUrl?: string;
  imageUrl?: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  bio?: string;
  organization?: string;
  currentRole?: string;
  targetRole?: string;
  skillsList?: string[];
  location?: string;
  socials?: UserSocials;
  overallScore?: number;
  readinessScore?: number;
  followersCount: number;
  followingCount: number;
  coursesCount: number;
  isFollowing: boolean;
  isSelf?: boolean;
  followedAt?: string;
}

export interface ActivityDay {
  date: string;
  count: number;
  level: number;
  tooltip: string;
}

export interface ActivityHeatmapResponse {
  days: ActivityDay[];
  metrics: {
    currentStreak: number;
    longestStreak: number;
    totalActiveDays: number;
    totalActivities: number;
    totalHours: number;
  };
}

export interface Recommendation {
  id: string;
  authorId: string;
  recipientId: string;
  relationship: string;
  content: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
    organization?: string;
    currentRole?: string;
  };
}

export interface RecommendationsResponse {
  recommendations: Recommendation[];
  pendingRecommendations: Recommendation[];
  myWrittenRecommendation?: Recommendation | null;
  stats: {
    totalAccepted: number;
    totalPending: number;
  };
}

export const userApi = {
  getProfile: (id: string) => 
    api.get<{ 
      user: PublicUserProfile; 
      isSelf: boolean; 
      isFollowing: boolean; 
      endorsements?: Record<string, SkillEndorsementInfo>;
      stats: { followersCount: number; followingCount: number; coursesCount: number; evidencesCount: number } 
    }>(`/api/users/${id}`),

  getActivityHeatmap: (id: string, range: '6months' | '1year' = '6months') =>
    api.get<ActivityHeatmapResponse>(`/api/users/${id}/activity`, { params: { range } }),

  getUserProjects: (userId: string) =>
    api.get<{ projects: UserProject[] }>(`/api/users/${userId}/projects`),

  createProject: (data: { title: string; description: string; tags?: string[]; githubUrl?: string; demoUrl?: string; imageUrl?: string; featured?: boolean }) =>
    api.post<{ success: boolean; message: string; project: UserProject }>(`/api/users/projects`, data),

  updateProject: (projectId: string, data: { title?: string; description?: string; tags?: string[]; githubUrl?: string; demoUrl?: string; imageUrl?: string; featured?: boolean }) =>
    api.put<{ success: boolean; message: string; project: UserProject }>(`/api/users/projects/${projectId}`, data),

  deleteProject: (projectId: string) =>
    api.delete<{ success: boolean; message: string }>(`/api/users/projects/${projectId}`),

  getRecommendations: (userId: string) =>
    api.get<RecommendationsResponse>(`/api/users/${userId}/recommendations`),

  createRecommendation: (userId: string, data: { relationship: string; content: string }) =>
    api.post<{ success: boolean; message: string; recommendation: Recommendation }>(`/api/users/${userId}/recommendations`, data),

  respondRecommendation: (recommendationId: string, status: 'ACCEPTED' | 'REJECTED') =>
    api.put<{ success: boolean; message: string; recommendation: Recommendation }>(`/api/users/recommendations/${recommendationId}/status`, { status }),

  deleteRecommendation: (recommendationId: string) =>
    api.delete<{ success: boolean; message: string }>(`/api/users/recommendations/${recommendationId}`),

  toggleFollow: (id: string) => 
    api.post<{ success: boolean; isFollowing: boolean; followersCount: number; message: string }>(`/api/users/${id}/follow`),

  toggleEndorse: (id: string, skillName: string) => 
    api.post<{ success: boolean; endorsed: boolean; count: number; skillName: string; message: string }>(`/api/users/${id}/endorse`, { skillName }),

  getFollowers: (id: string) => 
    api.get<{ followers: UserSummary[]; totalCount: number }>(`/api/users/${id}/followers`),

  getFollowing: (id: string) => 
    api.get<{ following: UserSummary[]; totalCount: number }>(`/api/users/${id}/following`),

  discoverUsers: (params?: { q?: string; role?: string; organization?: string; limit?: number }) => 
    api.get<{ users: UserSummary[]; total: number }>(`/api/users/discover`, { params }),
};
