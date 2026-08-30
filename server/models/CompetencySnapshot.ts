import mongoose, { Schema } from 'mongoose';

const competencySnapshotSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  overallScore: { type: Number, required: true },
  competencyDNA: {
    technical: Number,
    analytical: Number,
    communication: Number,
    leadership: Number,
    creativity: Number
  },
  roleReadiness: { type: Number, required: true },
  skills: [{
    skillId: { type: Schema.Types.ObjectId, ref: 'Skill' },
    score: Number
  }],
  trigger: { type: String, enum: ['assessment', 'course_completion', 'manual', 'scheduled'], required: true },
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('CompetencySnapshot', competencySnapshotSchema);
