import mongoose from 'mongoose';
import CompetencyProfile from '../models/CompetencyProfile';
import CompetencySnapshot from '../models/CompetencySnapshot';
import InsightEvent from '../models/InsightEvent';
import { calculateSkillScore, calculateCompetencyDNA, calculateOverallScore } from './competencyEngine';
import { calculateRoleReadiness } from './readinessEngine';
import { analyzeSkillGaps } from './skillGapEngine';

export const runCapacityCycle = async (userId: string, targetRoleId: string, trigger: string) => {
  const profile = await CompetencyProfile.findOne({ userId }).exec();
  if (!profile) throw new Error('Profile not found');

  // 1. Recalculate all skills
  for (let i = 0; i < profile.skills.length; i++) {
    if (profile.skills[i].skillId) {
      const newScore = await calculateSkillScore(userId, profile.skills[i].skillId!.toString());
      profile.skills[i].score = newScore;
      profile.skills[i].lastUpdated = new Date();
    }
  }

  // 2. Recalculate DNA & Overall
  await profile.save(); 
  const newDna = await calculateCompetencyDNA(userId);
  if (newDna) {
    profile.competencyDNA = newDna;
    profile.overallScore = calculateOverallScore(newDna);
  }

  // 3. Recalculate Role Readiness
  const readiness = await calculateRoleReadiness(targetRoleId, profile.skills as any);
  if (!profile.roleReadiness) profile.roleReadiness = { readinessScore: 0 };
  profile.roleReadiness.readinessScore = readiness.readinessScore;
  profile.lastCalculatedAt = new Date();
  profile.version = (profile.version || 0) + 1;

  await profile.save();

  // 4. Create Historical Snapshot
  const snapshot = new CompetencySnapshot({
    userId,
    overallScore: profile.overallScore,
    competencyDNA: profile.competencyDNA,
    roleReadiness: profile.roleReadiness.readinessScore,
    skills: profile.skills.map(s => ({ skillId: s.skillId, score: s.score })),
    trigger
  });
  await snapshot.save();

  // 5. Run Skill Gap Analysis & Check for insights
  const gaps = await analyzeSkillGaps(userId, targetRoleId);
  if (gaps.length > 0 && gaps[0].severity === 'CRITICAL') {
    const insight = new InsightEvent({
      userId,
      type: 'CRITICAL_GAP_DETECTED',
      title: 'Critical Skill Gap',
      description: `Your gap in ${gaps[0].skillName} is critical for your target role.`,
      priority: 'CRITICAL'
    });
    await insight.save();
  }

  return { profile, gaps };
};
