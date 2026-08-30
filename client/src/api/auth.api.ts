import api from './axios';

export const authApi = {
  login: (data: any) => api.post('/api/auth/login', data),
  register: (data: any) => api.post('/api/auth/register', data),
  getMe: () => api.get('/api/auth/me'),
};
