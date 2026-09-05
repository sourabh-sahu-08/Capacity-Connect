import prisma from '../config/prisma';

export const getWorkforceOverview = async () => {
  const learners = await prisma.user.count({ where: { role: 'LEARNER' } });
  
  const profiles = await prisma.competencyProfile.findMany();
  const totalCompetency = profiles.reduce((sum, p) => sum + p.overallScore, 0);
  const avgCompetency = learners > 0 ? (totalCompetency / profiles.length) : 0;

  return {
    totalActiveLearners: learners,
    averageCompetency: avgCompetency,
    learningVelocity: '+12%' // Mocked for hackathon
  };
};

export const getAttentionQueue = async () => {
  const alerts = await prisma.insightEvent.findMany({
    where: {
      type: { in: ['LEARNER_AT_RISK', 'CRITICAL_GAP_DETECTED'] },
      isRead: false
    },
    include: { user: { select: { name: true } } }
  });
  
  return alerts.map((a: any) => ({
    learner: a.user?.name || 'Unknown Learner',
    riskScore: a.priority === 'CRITICAL' ? 85 : 55,
    reason: a.description,
    recommendedIntervention: 'Schedule mentor session'
  }));
};
