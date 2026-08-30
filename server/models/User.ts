import mongoose, { Schema } from 'mongoose';
import { Role } from 'shared';

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: Object.values(Role), default: Role.LEARNER },
  organization: { type: String },
  profile: {
    avatar: String,
    bio: String,
    currentRole: String,
    targetRole: String,
    learningGoal: String,
    experienceLevel: String,
  },
  isOnboarded: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
