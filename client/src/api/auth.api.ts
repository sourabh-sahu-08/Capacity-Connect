import api from './axios';

export const authApi = {
  login: (data: any) => api.post('/api/auth/login', data),
  register: (data: any) => api.post('/api/auth/register', data),
  getMe: () => api.get('/api/auth/me'),
  forgotPassword: (data: { email: string }) => api.post('/api/auth/forgot-password', data),
  resetPassword: (token: string, data: { password: string }) => api.post(`/api/auth/reset-password/${token}`, data),
};
