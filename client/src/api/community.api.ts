import api from './axios';

export const communityApi = {
  getPosts: () => api.get('/api/community'),
  createPost: (data: any) => api.post('/api/community', data),
  upvote: (id: string) => api.post(`/api/community/${id}/upvote`),
  comment: (id: string, data: any) => api.post(`/api/community/${id}/comment`, data),
};
