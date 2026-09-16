const fs = require('fs');
let code = fs.readFileSync('server/services/managerIntelligenceService.ts', 'utf8');

if (!code.includes('getTeamReadiness')) {
const newService = 
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
;
code = code + newService;
fs.writeFileSync('server/services/managerIntelligenceService.ts', code);
console.log('Added getTeamReadiness');
}
