import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { analyzeSkillGaps } from '../services/skillGapEngine';
import { getNextBestAction } from '../services/recommendationEngine';
import { runCapacityCycle } from '../services/capacityCycleService';

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const profile = await prisma.competencyProfile.findUnique({
      where: { userId },
      include: { skills: { include: { skill: true } } }
    });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    // Get growth
    const snapshots = await prisma.competencySnapshot.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 2
    });
    const previousScore = snapshots.length > 1 ? snapshots[1].overallScore : profile.overallScore;
    const growth = profile.overallScore - previousScore;

    res.json({
      overallScore: profile.overallScore,
      competencyDNA: {
        technical: profile.dnaTechnical,
        analytical: profile.dnaAnalytical,
        communication: profile.dnaCommunication,
        leadership: profile.dnaLeadership,
        creativity: profile.dnaCreativity,
      },
      roleReadiness: {
        currentRole: profile.currentRole,
        targetRole: profile.targetRole,
        readinessScore: profile.readinessScore,
      },
      growth: { monthly: growth, previousScore }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getSkillGaps = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    let { targetRoleId } = req.body;
    
    if (!targetRoleId) {
      const firstRole = await prisma.roleRequirement.findFirst();
      if (firstRole) targetRoleId = firstRole.id;
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
    const userId = (req as any).user.id;
    const { targetRoleId, trigger } = req.body;
    const result = await runCapacityCycle(userId, targetRoleId, trigger);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: (error as any).message });
  }
};
