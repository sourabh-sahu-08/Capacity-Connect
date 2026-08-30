import api from './axios';

export const assessmentApi = {
  getById: (id: string) => api.get(`/api/assessments/${id}`),
  submit: (id: string, data: any) => api.post(`/api/assessments/${id}/submit`, data),
};
