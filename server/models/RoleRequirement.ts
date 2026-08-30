import mongoose, { Schema } from 'mongoose';

const roleRequirementSchema = new Schema({
  roleName: { type: String, required: true, unique: true },
  skills: [{
    skillId: { type: Schema.Types.ObjectId, ref: 'Skill', required: true },
    requiredLevel: { type: Number, min: 0, max: 100, required: true },
    importance: { type: Number, min: 0, max: 1, required: true },
    businessDemand: { type: Number, min: 0, max: 1, required: true }
  }]
});
export default mongoose.model('RoleRequirement', roleRequirementSchema);
