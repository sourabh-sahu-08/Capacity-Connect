import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User';
import Competency from './models/Competency';
import bcrypt from 'bcryptjs';
import { Role } from 'shared';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/capacity-connect');
    console.log('MongoDB Connected');

    await User.deleteMany();
    await Competency.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const learner = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword,
      role: Role.LEARNER,
      organization: 'Tech Corp',
    });

    const manager = await User.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: hashedPassword,
      role: Role.MANAGER,
      organization: 'Tech Corp',
    });

    console.log('Users created');

    await Competency.create([
      {
        user: learner._id,
        skillName: 'React.js',
        category: 'Technical',
        overallScore: 88,
        factors: { assessmentPerformance: 90, courseProgress: 85, practicalTasks: 90, learningConsistency: 80 }
      },
      {
        user: learner._id,
        skillName: 'Node.js',
        category: 'Technical',
        overallScore: 70,
        factors: { assessmentPerformance: 70, courseProgress: 75, practicalTasks: 65, learningConsistency: 70 }
      },
      {
        user: learner._id,
        skillName: 'Problem Solving',
        category: 'Professional',
        overallScore: 80,
        factors: { assessmentPerformance: 80, courseProgress: 80, practicalTasks: 80, learningConsistency: 80 }
      }
    ]);

    console.log('Competencies created');

    console.log('Seed successful');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedDatabase();
