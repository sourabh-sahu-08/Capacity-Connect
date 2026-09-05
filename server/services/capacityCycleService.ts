import prisma from '../config/prisma';
import { calculateSkillScore, calculateCompetencyDNA, calculateOverallScore } from './competencyEngine';
import { calculateRoleReadiness } from './readinessEngine';
import { analyzeSkillGaps } from './skillGapEngine';

export const runCapacityCycle = async (userId: string, targetRoleId: string, trigger: string) => {
  const profile = await prisma.competencyProfile.findUnique({
    where: { userId },
    include: { skills: true }
  });
  if (!profile) throw new Error('Profile not found');

  // 1. Recalculate all skills
  for (let i = 0; i < profile.skills.length; i++) {
    if (profile.skills[i].skillId) {
      const newScore = await calculateSkillScore(userId, profile.skills[i].skillId);
      await prisma.profileSkill.update({
        where: { id: profile.skills[i].id },
        data: { score: newScore, lastUpdated: new Date() }
      });
    }
  }

  // 2. Recalculate DNA & Overall
  const newDna = await calculateCompetencyDNA(userId);
  let overallScore = profile.overallScore;
  if (newDna) {
    overallScore = calculateOverallScore(newDna);
    await prisma.competencyProfile.update({
      where: { userId },
      data: {
        dnaTechnical: newDna.technical,
        dnaAnalytical: newDna.analytical,
        dnaCommunication: newDna.communication,
        dnaLeadership: newDna.leadership,
        dnaCreativity: newDna.creativity,
        overallScore,
      }
    });
  }

  // 3. Recalculate Role Readiness
  const updatedProfile = await prisma.competencyProfile.findUnique({ where: { userId }, include: { skills: true } });
  const readiness = await calculateRoleReadiness(targetRoleId, (updatedProfile?.skills || []) as any);
  
  const finalProfile = await prisma.competencyProfile.update({
    where: { userId },
    data: {
      readinessScore: readiness.readinessScore,
      lastCalculatedAt: new Date(),
      version: (profile.version || 0) + 1,
    },
    include: { skills: true }
  });

  // 4. Create Historical Snapshot
  await prisma.competencySnapshot.create({
    data: {
      userId,
      overallScore: finalProfile.overallScore,
      dnaTechnical: finalProfile.dnaTechnical,
      dnaAnalytical: finalProfile.dnaAnalytical,
      dnaCommunication: finalProfile.dnaCommunication,
      dnaLeadership: finalProfile.dnaLeadership,
      dnaCreativity: finalProfile.dnaCreativity,
      roleReadiness: finalProfile.readinessScore,
      trigger,
      skills: {
        create: finalProfile.skills.map(s => ({ skillId: s.skillId, score: s.score }))
      }
    }
  });

  // 5. Run Skill Gap Analysis & Check for insights
  const gaps = await analyzeSkillGaps(userId, targetRoleId);
  if (gaps.length > 0 && gaps[0].severity === 'CRITICAL') {
    await prisma.insightEvent.create({
      data: {
        userId,
        type: 'CRITICAL_GAP_DETECTED',
        title: 'Critical Skill Gap',
        description: `Your gap in ${gaps[0].skillName} is critical for your target role.`,
        priority: 'CRITICAL'
      }
    });
  }

  return { profile: finalProfile, gaps };
};
