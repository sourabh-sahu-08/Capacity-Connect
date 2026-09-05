import prisma from '../config/prisma';

export const calculateRoleReadiness = async (roleId: string, userSkills: Array<{skillId: any, score: number}>) => {
  const role = await prisma.roleRequirement.findUnique({
    where: { id: roleId },
    include: { skills: true }
  });
  if (!role) return { readinessScore: 0, criticalGaps: [], matchingSkills: [] };

  let totalWeightedScore = 0;
  let totalImportance = 0;
  const criticalGaps: any[] = [];
  const matchingSkills: any[] = [];

  role.skills.forEach((req: any) => {
    const userSkill = userSkills.find(s => s.skillId.toString() === req.skillId.toString());
    const currentScore = userSkill ? userSkill.score : 0;
    
    // Cap at required level
    const cappedScore = Math.min(currentScore, req.requiredLevel);
    // Contribution based on percentage of required level
    const contribution = req.requiredLevel > 0 ? (cappedScore / req.requiredLevel) * 100 : 100;
    
    totalWeightedScore += (contribution * req.importance);
    totalImportance += req.importance;

    const gap = req.requiredLevel - currentScore;
    if (gap > 20) {
      criticalGaps.push({ skillId: req.skillId, gap, required: req.requiredLevel, current: currentScore });
    }
    if (gap <= 0) {
      matchingSkills.push({ skillId: req.skillId, current: currentScore });
    }
  });

  const overallReadiness = totalImportance > 0 ? (totalWeightedScore / totalImportance) : 0;

  return {
    readinessScore: overallReadiness,
    criticalGaps,
    matchingSkills
  };
};
