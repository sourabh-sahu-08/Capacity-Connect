import CompetencyProfile from '../models/CompetencyProfile';
import InsightEvent from '../models/InsightEvent';
import User from '../models/User';

export const getWorkforceOverview = async () => {
  const learners = await User.countDocuments({ role: 'LEARNER' });
  
  const profiles = await CompetencyProfile.find().exec();
  const totalCompetency = profiles.reduce((sum, p) => sum + p.overallScore, 0);
  const avgCompetency = learners > 0 ? (totalCompetency / profiles.length) : 0;

  return {
    totalActiveLearners: learners,
    averageCompetency: avgCompetency,
    learningVelocity: '+12%' // Mocked for hackathon
  };
};

export const getAttentionQueue = async () => {
  const alerts = await InsightEvent.find({ 
    type: { $in: ['LEARNER_AT_RISK', 'CRITICAL_GAP_DETECTED'] }, 
    isRead: false 
  }).populate('userId', 'name').exec();
  
  return alerts.map(a => ({
    learner: (a.userId as any).name || 'Unknown Learner',
    riskScore: a.priority === 'CRITICAL' ? 85 : 55,
    reason: a.description,
    recommendedIntervention: 'Schedule mentor session'
  }));
};
