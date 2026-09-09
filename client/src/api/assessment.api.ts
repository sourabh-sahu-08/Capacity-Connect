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
  getById: (id: string) => api.get(`/api/assessments/${id}`),
  submit: (id: string, data: any) => api.post(`/api/assessments/${id}/attempt`, data),
  grade: (attemptId: string, data: any) => api.post(`/api/assessments/attempt/${attemptId}/grade`, data),
};
