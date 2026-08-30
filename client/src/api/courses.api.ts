import api from './axios';

export const coursesApi = {
  getAll: () => api.get('/api/courses'),
  getById: (id: string) => api.get(`/api/courses/${id}`),
  create: (data: any) => api.post('/api/courses', data),
};
