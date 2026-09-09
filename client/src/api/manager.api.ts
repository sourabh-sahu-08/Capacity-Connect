import api from './axios';

export interface SkillItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  description?: string;
  difficultyLevel?: number;
}

export interface MatrixRow {
  learner: {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
    currentRole: string;
    targetRole: string;
    organization: string;
    experienceLevel: string;
    overallScore: number;
    readinessScore: number;
    dna: {
      technical: number;
      analytical: number;
      communication: number;
      leadership: number;
      creativity: number;
    };
  };
  skills: Record<string, {
    score: number;
    confidence: number;
    evidenceCount: number;
    lastUpdated: string | null;
  }>;
}

export interface CapabilityMatrixResponse {
  skills: SkillItem[];
  matrix: MatrixRow[];
  stats: {
    totalLearners: number;
    totalSkills: number;
    teamAverageScore: number;
    topStrengths: Array<{
      skillId: string;
      name: string;
      category: string;
      averageScore: number;
      assessedCount: number;
      masteredCount: number;
      coveragePct: number;
    }>;
    criticalGaps: Array<{
      skillId: string;
      name: string;
      category: string;
      averageScore: number;
      assessedCount: number;
      masteredCount: number;
      coveragePct: number;
    }>;
  };
}

export interface RoleRequirementItem {
  id: string;
  roleName: string;
  skills: Array<{
    id: string;
    skillId: string;
    requiredLevel: number;
    importance: number;
    businessDemand: number;
    skill: SkillItem;
  }>;
}

export interface MobilityCandidate {
  candidate: {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
    currentRole: string;
    targetRole?: string | null;
    overallScore: number;
  };
  readinessScore: number;
  fitCategory: 'READY_NOW' | 'UPSKILLING_REQUIRED' | 'HIGH_GAP';
  skillGaps: Array<{
    skillId: string;
    skillName: string;
    category: string;
    requiredLevel: number;
    currentScore: number;
    gap: number;
    importance: number;
    isMet: boolean;
    priority: 'CRITICAL' | 'MODERATE' | 'LOW';
  }>;
  criticalGapCount: number;
  recommendedCourses: Array<{
    id: string;
    title: string;
    description: string;
    targetCompetencies: string[];
  }>;
  estimatedUpskillWeeks: number;
}

export interface TalentMobilityResponse {
  targetRole: {
    id: string;
    roleName: string;
    requiredSkillsCount: number;
    requiredSkills: Array<{
      skillId: string;
      name: string;
      requiredLevel: number;
      importance: number;
    }>;
  };
  benchSummary: {
    totalCandidates: number;
    readyNowCount: number;
    upskillingCount: number;
    highGapCount: number;
    averageReadiness: number;
  };
  candidates: MobilityCandidate[];
}

export interface WorkforceReadinessItem {
  roleId: string;
  roleName: string;
  targetHeadcount: number;
  readyHeadcount: number;
  pipelineHeadcount: number;
  averageReadiness: number;
  benchDeficit: number;
  healthStatus: 'HEALTHY' | 'WATCH' | 'CRITICAL';
}

export const managerApi = {
  getOverview: async () => {
    const res = await api.get('/api/manager/overview');
    return res.data;
  },
  getQueue: async () => {
    const res = await api.get('/api/manager/attention-queue');
    return res.data;
  },
  getCapabilityMatrix: async (): Promise<CapabilityMatrixResponse> => {
    const res = await api.get('/api/manager/capability-matrix');
    return res.data;
  },
  getRoles: async (): Promise<RoleRequirementItem[]> => {
    const res = await api.get('/api/manager/roles');
    return res.data;
  },
  simulateMobility: async (targetRoleId: string, minThreshold = 0): Promise<TalentMobilityResponse> => {
    const res = await api.post('/api/manager/simulate-mobility', { targetRoleId, minThreshold });
    return res.data;
  },
  getWorkforceReadiness: async (): Promise<WorkforceReadinessItem[]> => {
    const res = await api.get('/api/manager/readiness');
    return res.data;
  }
};
