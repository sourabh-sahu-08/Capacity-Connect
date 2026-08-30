import mongoose, { Schema } from 'mongoose';

const competencySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  skillName: { type: String, required: true },
  category: { type: String, required: true },
  overallScore: { type: Number, default: 0 },
  factors: {
    assessmentPerformance: { type: Number, default: 0 },
    courseProgress: { type: Number, default: 0 },
    practicalTasks: { type: Number, default: 0 },
    learningConsistency: { type: Number, default: 0 },
  },
  history: [
    {
      date: { type: Date, default: Date.now },
      score: { type: Number, required: true },
    }
  ]
}, { timestamps: true });

export default mongoose.model('Competency', competencySchema);
