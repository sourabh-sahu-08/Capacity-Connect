import { Request, Response } from 'express';
import { getWorkforceOverview, getAttentionQueue } from '../services/managerIntelligenceService';

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
