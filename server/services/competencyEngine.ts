import CompetencyProfile from '../models/CompetencyProfile';
import CompetencyEvidence from '../models/CompetencyEvidence';
import Skill from '../models/Skill';

export const calculateSkillScore = async (userId: string, skillId: string): Promise<number> => {
  const evidenceList = await CompetencyEvidence.find({ userId, skillId }).exec();
  if (!evidenceList || evidenceList.length === 0) return 0;

  let totalWeightedScore = 0;
  let totalWeight = 0;

  evidenceList.forEach(evidence => {
    totalWeightedScore += (evidence.score * evidence.weight);
    totalWeight += evidence.weight;
  });

  return totalWeight > 0 ? (totalWeightedScore / totalWeight) : 0;
};

export const calculateCompetencyDNA = async (userId: string) => {
  const profile = await CompetencyProfile.findOne({ userId }).populate('skills.skillId').exec();
  if (!profile) return null;

  const dna = {
    technical: 0, analytical: 0, communication: 0, leadership: 0, creativity: 0
  };
  const counts = {
    technical: 0, analytical: 0, communication: 0, leadership: 0, creativity: 0
  };

  profile.skills.forEach(userSkill => {
    const skill = userSkill.skillId as any;
    if (skill && skill.category) {
      const cat = skill.category as keyof typeof dna;
      if (dna[cat] !== undefined) {
        dna[cat] += userSkill.score;
        counts[cat] += 1;
      }
    }
  });

  Object.keys(dna).forEach(key => {
    const k = key as keyof typeof dna;
    dna[k] = counts[k] > 0 ? (dna[k] / counts[k]) : 0;
  });

  return dna;
};

export const calculateOverallScore = (dna: any): number => {
  const values = Object.values(dna) as number[];
  if (values.length === 0) return 0;
  const sum = values.reduce((a, b) => a + b, 0);
  return sum / values.length;
};
