export const generateLearningPath = (role: any, skillGaps: any[]) => {
  // Simple phased approach for hackathon
  const critical = skillGaps.filter(g => g.severity === 'CRITICAL' || g.severity === 'HIGH');
  const medium = skillGaps.filter(g => g.severity === 'MEDIUM');
  
  const phases = [];
  
  if (critical.length > 0) {
    phases.push({
      title: 'Phase 1: Core Foundations',
      objective: 'Address critical skill gaps blocking role readiness.',
      skills: critical.map(c => c.skillId),
      estimatedHours: critical.length * 5,
      status: 'InProgress'
    });
  }
  
  if (medium.length > 0) {
    phases.push({
      title: 'Phase 2: Capability Expansion',
      objective: 'Develop secondary skills to round out role profile.',
      skills: medium.map(m => m.skillId),
      estimatedHours: medium.length * 4,
      status: 'Locked'
    });
  }
  
  phases.push({
    title: 'Phase 3: Validation',
    objective: 'Complete final assessments and practical challenges.',
    skills: [],
    estimatedHours: 2,
    status: 'Locked'
  });
  
  return phases;
};
