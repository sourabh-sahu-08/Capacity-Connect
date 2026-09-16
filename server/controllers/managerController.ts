import { Request, Response } from 'express';
import { getWorkforceOverview, getAttentionQueue, getOrganizationalSkillGaps, getTeamReadiness } from '../services/managerIntelligenceService';

export const getOverview = async (req: Request, res: Response) => {
  try {
    const overview = await getWorkforceOverview();
    res.json(overview);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getQueue = async (req: Request, res: Response) => {
  try {
    const queue = await getAttentionQueue();
    res.json(queue);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getSkillGaps = async (req: Request, res: Response) => {
  try {
    const gaps = await getOrganizationalSkillGaps();
    res.json(gaps);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getTeams = async (req: Request, res: Response) => {
  try {
    const teams = await getTeamReadiness();
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
