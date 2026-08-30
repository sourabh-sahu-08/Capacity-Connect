import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

export const getCompetencyProfile = async (token: string) => {
  const res = await axios.get(`${API_URL}/competency/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getSkillGaps = async (token: string, targetRoleId: string) => {
  const res = await axios.post(`${API_URL}/competency/analyze`, { targetRoleId }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getManagerOverview = async (token: string) => {
  const res = await axios.get(`${API_URL}/manager/overview`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getAttentionQueue = async (token: string) => {
  const res = await axios.get(`${API_URL}/manager/attention-queue`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
