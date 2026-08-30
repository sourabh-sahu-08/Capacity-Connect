import { Request, Response } from 'express';
import mongoose from 'mongoose';
import CompetencyProfile from '../models/CompetencyProfile';
import RoleRequirement from '../models/RoleRequirement';
import { analyzeSkillGaps } from '../services/skillGapEngine';
import { getNextBestAction } from '../services/recommendationEngine';
import CompetencySnapshot from '../models/CompetencySnapshot';
import { runCapacityCycle } from '../services/capacityCycleService';

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const profile = await CompetencyProfile.findOne({ userId }).populate('skills.skillId').exec();
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    // Get growth
    const snapshots = await CompetencySnapshot.find({ userId }).sort({ createdAt: -1 }).limit(2).exec();
    const previousScore = snapshots.length > 1 ? snapshots[1].overallScore : profile.overallScore;
    const growth = profile.overallScore - previousScore;

    res.json({
      overallScore: profile.overallScore,
      competencyDNA: profile.competencyDNA,
      roleReadiness: profile.roleReadiness,
      growth: { monthly: growth, previousScore }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getSkillGaps = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    let { targetRoleId } = req.body;
    
    if (!targetRoleId || !mongoose.Types.ObjectId.isValid(targetRoleId)) {
      const firstRole = await RoleRequirement.findOne().exec();
      if (firstRole) targetRoleId = firstRole._id.toString();
    }

    const gaps = await analyzeSkillGaps(userId, targetRoleId);
    const nba = getNextBestAction(gaps);

    res.json({ gaps, nextBestAction: nba });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const triggerCycle = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const { targetRoleId, trigger } = req.body;
    const result = await runCapacityCycle(userId, targetRoleId, trigger);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: (error as any).message });
  }
};
