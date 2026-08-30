import Competency from '../models/Competency';

export const calculateCompetencyScore = async (userId: string, skillName: string) => {
  const comp = await Competency.findOne({ user: userId, skillName });
  if (!comp) return 0;

  const weights = {
    assessmentPerformance: 0.40,
    courseProgress: 0.25,
    practicalTasks: 0.25,
    learningConsistency: 0.10
  };

  const score = 
    (comp.factors.assessmentPerformance * weights.assessmentPerformance) +
    (comp.factors.courseProgress * weights.courseProgress) +
    (comp.factors.practicalTasks * weights.practicalTasks) +
    (comp.factors.learningConsistency * weights.learningConsistency);

  comp.overallScore = Math.round(score);
  
  // Add to history if changed significantly or just periodically
  // For simplicity, add if it's the first time or different from last history entry
  const lastHistory = comp.history[comp.history.length - 1];
  if (!lastHistory || lastHistory.score !== comp.overallScore) {
    comp.history.push({ date: new Date(), score: comp.overallScore });
  }

  await comp.save();
  return comp.overallScore;
};

export const updateFactor = async (userId: string, skillName: string, category: string, factor: 'assessmentPerformance' | 'courseProgress' | 'practicalTasks' | 'learningConsistency', value: number) => {
  let comp = await Competency.findOne({ user: userId, skillName });
  if (!comp) {
    comp = new Competency({ user: userId, skillName, category });
  }
  
  comp.factors[factor] = value;
  await comp.save();
  await calculateCompetencyScore(userId, skillName);
};
