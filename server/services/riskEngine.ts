import prisma from '../config/prisma';

export const calculateLearnerRisk = async (userId: string) => {
  const latestEvidence = await prisma.competencyEvidence.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
  
  let inactivityScore = 0;
  if (latestEvidence) {
    const daysInactive = (Date.now() - latestEvidence.createdAt.getTime()) / (1000 * 3600 * 24);
    if (daysInactive > 14) inactivityScore = 100;
    else if (daysInactive > 7) inactivityScore = 50;
  } else {
    inactivityScore = 100;
  }

  const riskScore = (inactivityScore * 0.35) + (50 * 0.30) + (40 * 0.20) + (10 * 0.15);
  
  let classification = 'LOW';
  if (riskScore >= 61) classification = 'HIGH';
  else if (riskScore >= 31) classification = 'MEDIUM';

  return { riskScore, classification };
};
