import prisma from '../config/prisma';

export const analyzeSkillGaps = async (userId: string, roleId: string) => {
  if (!roleId) return [];
  
  const profile = await prisma.competencyProfile.findUnique({
    where: { userId },
    include: { skills: true }
  });
  const role = await prisma.roleRequirement.findUnique({
    where: { id: roleId },
    include: { skills: { include: { skill: true } } }
  });

  if (!profile || !role) return [];

  const gaps = role.skills.map((req: any) => {
    const skillDoc = req.skill;
    const userSkill = profile.skills.find(s => s.skillId === skillDoc.id);
    const currentScore = userSkill ? userSkill.score : 0;
    const gap = Math.max(0, req.requiredLevel - currentScore);
    
    const normalizedGap = req.requiredLevel > 0 ? (gap / req.requiredLevel) : 0;
    const priorityScore = normalizedGap * req.importance * req.businessDemand * 100;
    
    let severity = 'LOW';
    if (priorityScore >= 60) severity = 'CRITICAL';
    else if (priorityScore >= 40) severity = 'HIGH';
    else if (priorityScore >= 20) severity = 'MEDIUM';

    return {
      skillId: skillDoc.id,
      skillName: skillDoc.name,
      currentScore,
      requiredScore: req.requiredLevel,
      gap,
      priorityScore,
      severity
    };
  });

  return gaps.sort((a: any, b: any) => b.priorityScore - a.priorityScore);
};
