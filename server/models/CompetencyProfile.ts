import mongoose, { Schema } from 'mongoose';
import './Skill';

const competencyProfileSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  overallScore: { type: Number, default: 0 },
  roleReadiness: {
    currentRole: String,
    targetRole: String,
    readinessScore: { type: Number, default: 0 }
  },
  competencyDNA: {
    technical: { type: Number, default: 0 },
    analytical: { type: Number, default: 0 },
    communication: { type: Number, default: 0 },
    leadership: { type: Number, default: 0 },
    creativity: { type: Number, default: 0 }
  },
  skills: [{
    skillId: { type: Schema.Types.ObjectId, ref: 'Skill' },
    score: { type: Number, default: 0 },
    confidence: { type: Number, default: 0 },
    evidenceCount: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now }
  }],
  version: { type: Number, default: 1 },
  lastCalculatedAt: { type: Date, default: Date.now }
});
export default mongoose.model('CompetencyProfile', competencyProfileSchema);
