import mongoose, { Schema } from 'mongoose';

const insightEventSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  organizationId: { type: Schema.Types.ObjectId },
  type: { type: String, enum: ['COMPETENCY_IMPROVED', 'READINESS_INCREASED', 'CRITICAL_GAP_DETECTED', 'LEARNING_PATH_UPDATED', 'LEARNER_AT_RISK'], required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  metadata: { type: Schema.Types.Mixed },
  priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'LOW' },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('InsightEvent', insightEventSchema);
