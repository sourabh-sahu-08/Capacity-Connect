import mongoose, { Schema } from 'mongoose';

const competencyEvidenceSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  skillId: { type: Schema.Types.ObjectId, ref: 'Skill', required: true },
  source: { type: String, enum: ['assessment', 'course', 'challenge', 'trainer_review'], required: true },
  score: { type: Number, required: true },
  weight: { type: Number, required: true },
  metadata: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('CompetencyEvidence', competencyEvidenceSchema);
