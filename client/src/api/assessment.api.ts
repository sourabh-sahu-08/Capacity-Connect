import api from './axios';

export interface AssessmentItem {
  _id: string;
  id: string;
  title: string;
  courseId: {
    id?: string;
    title?: string;
    targetCompetencies?: string[];
  } | string;
  trainerId: string;
  type: string;
  maxScore: number;
  status: string;
  createdAt: string;
  submissionsCount?: number;
  mySubmission?: AssessmentSubmissionItem | null;
  course?: {
    id: string;
    title: string;
    description?: string;
    targetCompetencies?: string[];
  };
  trainer?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface AssessmentSubmissionItem {
  id: string;
  assessmentId: string;
  userId: string;
  githubUrl?: string | null;
  demoUrl?: string | null;
  notes?: string | null;
  status: 'PENDING' | 'GRADED' | 'REJECTED';
  score?: number | null;
  feedback?: string | null;
  gradedAt?: string | null;
  gradedById?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
    targetRole?: string | null;
    currentRole?: string | null;
    organization?: string | null;
  };
  gradedBy?: {
    id: string;
    name: string;
  } | null;
  assessment?: {
    id: string;
    title: string;
    course?: {
      id: string;
      title: string;
    };
    trainer?: {
      id: string;
      name: string;
    };
  };
}

export const assessmentApi = {
  getAll: async (): Promise<AssessmentItem[]> => {
    const res = await api.get('/api/assessments');
    return res.data;
  },
  getById: async (id: string): Promise<AssessmentItem> => {
    const res = await api.get(`/api/assessments/${id}`);
    return res.data;
  },
  submit: async (id: string, data: { githubUrl?: string; demoUrl?: string; notes?: string }): Promise<{ message: string; submission: AssessmentSubmissionItem }> => {
    const res = await api.post(`/api/assessments/${id}/submit`, data);
    return res.data;
  },
  getMySubmissions: async (): Promise<AssessmentSubmissionItem[]> => {
    const res = await api.get('/api/assessments/my-submissions');
    return res.data;
  },
  getSubmissions: async (id: string): Promise<AssessmentSubmissionItem[]> => {
    const res = await api.get(`/api/assessments/${id}/submissions`);
    return res.data;
  },
  gradeSubmission: async (
    assessmentId: string,
    submissionId: string,
    data: { score: number; feedback: string; status?: 'GRADED' | 'REJECTED' }
  ): Promise<{ message: string; submission: AssessmentSubmissionItem }> => {
    const res = await api.post(`/api/assessments/${assessmentId}/submissions/${submissionId}/grade`, data);
    return res.data;
  }
};
