import mongoose, { Schema } from 'mongoose';

const skillSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, enum: ['technical', 'analytical', 'communication', 'leadership', 'creative'], required: true },
  description: { type: String, required: true },
  parentSkill: { type: Schema.Types.ObjectId, ref: 'Skill' },
  difficultyLevel: { type: Number, min: 1, max: 5, required: true },
  organizationId: { type: Schema.Types.ObjectId },
  isActive: { type: Boolean, default: true }
});
export default mongoose.model('Skill', skillSchema);
