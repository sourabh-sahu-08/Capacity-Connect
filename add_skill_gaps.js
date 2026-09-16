const fs = require('fs');

let code = fs.readFileSync('server/services/managerIntelligenceService.ts', 'utf8');

if (!code.includes('getOrganizationalSkillGaps')) {
const newService = 
export const getOrganizationalSkillGaps = async () => {
  // Find all required skills across target roles
  const requirements = await prisma.roleSkill.findMany({
    include: { skill: true }
  });
  
  // Aggregate learner competencies for these skills
  // (In our simplified schema, ProfileSkill holds individual competency)
  const userSkills = await prisma.profileSkill.findMany({
    include: { skill: true }
  });

  // Calculate gaps
  const gaps = [];
  
  // Group by skill
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
      // average out target if multiple roles require it
      skillMap.get(req.skillId).targetLevel = Math.max(skillMap.get(req.skillId).targetLevel, req.requiredLevel);
    }
  }
  
  for (const us of userSkills) {
    const req = skillMap.get(us.skillId);
    if (req) {
      if (us.level < req.targetLevel) {
        req.affected += 1;
        req.totalGap += (req.targetLevel - us.level);
      }
    }
  }
  
  // Convert to array and filter out no gaps
  const results = Array.from(skillMap.values())
    .filter(g => g.affected > 0)
    .sort((a, b) => b.totalGap - a.totalGap)
    .map((g, idx) => ({ id: idx + 1, skill: g.skillName, affected: g.affected, importance: g.importance, severity: g.severity }));
    
  return results;
};
;

code = code + newService;
fs.writeFileSync('server/services/managerIntelligenceService.ts', code);
console.log('Added getOrganizationalSkillGaps');
}
