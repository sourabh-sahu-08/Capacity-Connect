import api from './axios';

export const getCourses = async () => {
  const response = await api.get('/api/courses?myCourses=true');
  return response.data.data || response.data;
};

export const getCourseSummary = async () => {
  const response = await api.get('/api/courses?myCourses=true&summary=true&limit=3');
  return response.data.data || response.data;
};

export const createCourse = async (data: any) => {
  const response = await api.post('/api/courses', data);
  return response.data.data || response.data;
};

export const publishCourse = async (id: string) => {
  const response = await api.post(`/api/courses/${id}/publish`);
  return response.data.data || response.data;
};

export const getAssessments = async () => {
  const response = await api.get('/api/assessments');
  return response.data.data || response.data;
};

export const createAssessment = async (data: any) => {
  const response = await api.post('/api/assessments', data);
  return response.data.data || response.data;
};

export const getLearners = async () => {
  const response = await api.get('/api/enrollments/trainer/learners');
  return response.data.data || response.data;
};

export const getConversations = async () => {
  const response = await api.get('/api/conversations');
  return response.data.data || response.data;
};
