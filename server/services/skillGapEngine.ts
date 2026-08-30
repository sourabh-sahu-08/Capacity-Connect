import mongoose from 'mongoose';
import RoleRequirement from '../models/RoleRequirement';
import CompetencyProfile from '../models/CompetencyProfile';

export const analyzeSkillGaps = async (userId: string, roleId: string) => {
  if (!mongoose.Types.ObjectId.isValid(roleId)) return [];
  
  const profile = await CompetencyProfile.findOne({ userId }).exec();
  const role = await RoleRequirement.findById(roleId).populate('skills.skillId').exec();

  if (!profile || !role) return [];

  const gaps = role.skills.map(req => {
    const skillDoc = req.skillId as any;
    const userSkill = profile.skills.find(s => s.skillId && s.skillId.toString() === skillDoc._id.toString());
    const currentScore = userSkill ? userSkill.score : 0;
    const gap = Math.max(0, req.requiredLevel - currentScore);
    
    const normalizedGap = req.requiredLevel > 0 ? (gap / req.requiredLevel) : 0;
    const priorityScore = normalizedGap * req.importance * req.businessDemand * 100;
    
    let severity = 'LOW';
    if (priorityScore >= 60) severity = 'CRITICAL';
    else if (priorityScore >= 40) severity = 'HIGH';
    else if (priorityScore >= 20) severity = 'MEDIUM';

    return {
      skillId: skillDoc._id,
      skillName: skillDoc.name,
      currentScore,
      requiredScore: req.requiredLevel,
      gap,
      priorityScore,
      severity
    };
  });

  return gaps.sort((a, b) => b.priorityScore - a.priorityScore);
};
