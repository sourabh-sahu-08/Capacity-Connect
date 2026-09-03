import api from './axios';

export const getCourses = async () => {
  const response = await api.get('/api/courses');
  return response.data;
};

export const createCourse = async (data: any) => {
  const response = await api.post('/api/courses', data);
  return response.data;
};

export const getAssessments = async () => {
  const response = await api.get('/api/assessments');
  return response.data;
};

export const createAssessment = async (data: any) => {
  const response = await api.post('/api/assessments', data);
  return response.data;
};
