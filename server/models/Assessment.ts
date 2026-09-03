import mongoose, { Schema, Document } from 'mongoose';

export interface IAssessment extends Document {
  title: string;
  courseId: mongoose.Types.ObjectId;
  trainerId: mongoose.Types.ObjectId;
  type: 'Quiz' | 'Project' | 'Exam';
  maxScore: number;
  status: 'Active' | 'Draft' | 'Archived';
  createdAt: Date;
  updatedAt: Date;
}

const AssessmentSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    trainerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['Quiz', 'Project', 'Exam'], default: 'Project' },
    maxScore: { type: Number, default: 100 },
    status: { type: String, enum: ['Active', 'Draft', 'Archived'], default: 'Active' }
  },
  { timestamps: true }
);

export default mongoose.models.Assessment || mongoose.model<IAssessment>('Assessment', AssessmentSchema);
