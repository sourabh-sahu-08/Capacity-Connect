import api from './axios';

export const learningPathApi = {
  get: () => api.get('/api/learning-path'),
  generate: (data: any) => api.post('/api/learning-path/generate', data),
};
