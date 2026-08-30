export const getNextBestAction = (skillGaps: any[]) => {
  if (!skillGaps || skillGaps.length === 0) return null;
  
  // Highest priority gap
  const primaryGap = skillGaps[0];
  
  return {
    title: `Strengthen ${primaryGap.skillName}`,
    skillId: primaryGap.skillId,
    reason: `This is your highest-impact competency gap. Priority Score: ${primaryGap.priorityScore.toFixed(1)}`,
    estimatedImpact: Math.round(primaryGap.gap * 0.3), // Simulated impact
    estimatedHours: 6,
    actionType: 'learning_path',
    priority: primaryGap.severity
  };
};
