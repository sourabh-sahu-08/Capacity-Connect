import api from './axios';

export const competencyApi = {
  getProfile: () => api.get('/api/competencies'),
  analyzeGap: (data: any) => api.post('/api/competencies/analyze', data),
};
