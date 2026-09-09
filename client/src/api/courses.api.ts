import api from './axios';

export const coursesApi = {
  getAll: () => api.get('/api/courses'),
  getRecommended: () => api.get('/api/courses/recommended'),
  getById: (id: string) => api.get(`/api/courses/${id}`),
  create: (data: any) => api.post('/api/courses', data),
  enroll: (id: string) => api.post(`/api/courses/${id}/enroll`),
};

export const enrollmentsApi = {
  getMyEnrollments: () => api.get('/api/enrollments/my'),
  updateProgress: (enrollmentId: string, data: any) => api.patch(`/api/enrollments/${enrollmentId}/progress`, data)
};

export const chatApi = {
  getConversations: () => api.get('/api/conversations'),
  getOrCreateConversation: (data: any) => api.post('/api/conversations', data),
  getMessages: (conversationId: string) => api.get(`/api/conversations/${conversationId}/messages`),
};
