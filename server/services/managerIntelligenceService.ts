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

export const getOrganizationalSkillGaps = async () => {
  const requirements = await prisma.roleSkill.findMany({
    include: { skill: true }
  });
  
  const userSkills = await prisma.profileSkill.findMany({
    include: { skill: true }
  });

  const gaps: any[] = [];
  const skillMap = new Map();
  
  for (const req of requirements) {
    if (!skillMap.has(req.skillId)) {
      skillMap.set(req.skillId, {
        skillId: req.skillId,
        skillName: req.skill.name,
        targetLevel: req.requiredLevel,
        importance: req.importance > 80 ? 'Critical' : req.importance > 50 ? 'High' : 'Medium',
        severity: req.importance > 80 ? 'HIGH' : req.importance > 50 ? 'MEDIUM' : 'LOW',
        affected: 0,
        totalGap: 0
      });
    } else {
      skillMap.get(req.skillId).targetLevel = Math.max(skillMap.get(req.skillId).targetLevel, req.requiredLevel);
    }
  }
  
  for (const us of userSkills) {
    const req = skillMap.get(us.skillId);
    if (req) {
      if (us.score < req.targetLevel) {
        req.affected += 1;
        req.totalGap += (req.targetLevel - us.score);
      }
    }
  }
  
  const results = Array.from(skillMap.values())
    .filter(g => g.affected > 0)
    .sort((a, b) => b.totalGap - a.totalGap)
    .map((g, idx) => ({ 
      id: idx + 1, 
      skill: g.skillName, 
      affected: g.affected, 
      importance: g.importance, 
      severity: g.severity 
    }));
    
  return results;
};

export const getTeamReadiness = async () => {
  const users = await prisma.user.findMany({
    where: { role: 'LEARNER', currentRole: { not: null } },
    include: { competencyProfile: true }
  });

  const teams = new Map();

  for (const user of users) {
    if (!user.currentRole) continue;
    
    if (!teams.has(user.currentRole)) {
      teams.set(user.currentRole, {
        id: user.currentRole,
        name: user.currentRole,
        m: 0,
        comp: 0,
        read: 0,
        risk: 'Low'
      });
    }

    const team = teams.get(user.currentRole);
    team.m += 1;
    if (user.competencyProfile) {
      team.comp += user.competencyProfile.overallScore;
      team.read += user.competencyProfile.readinessScore;
    }
  }

  const results = Array.from(teams.values()).map(t => {
    const avgComp = t.m > 0 ? Math.round(t.comp / t.m) : 0;
    const avgRead = t.m > 0 ? Math.round(t.read / t.m) : 0;
    return {
      id: t.id,
      name: t.name,
      m: t.m,
      comp: avgComp,
      read: avgRead,
      risk: avgComp < 60 ? 'High' : 'Low'
    };
  });

  return results;
};
