import api from './axios';

export const getCompetencyProfile = async () => {
  const res = await api.get(`/api/competency/profile`);
  return res.data;
};

export const getSkillGaps = async (targetRoleId: string) => {
  const res = await api.post(`/api/competency/analyze`, { targetRoleId });
  return res.data;
};

export const getManagerOverview = async () => {
  const res = await api.get(`/api/manager/overview`);
  return res.data;
};

export const getAttentionQueue = async () => {
  const res = await api.get(`/api/manager/attention-queue`);
  return res.data;
};

export const getOrganizationalSkillGaps = async () => {
  const res = await api.get(`/api/manager/skill-gaps`);
  return res.data;
};

export const getTeams = async () => {
  const res = await api.get(`/api/manager/teams`);
  return res.data;
};
