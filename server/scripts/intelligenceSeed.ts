import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import Skill from '../models/Skill';
import RoleRequirement from '../models/RoleRequirement';
import CompetencyProfile from '../models/CompetencyProfile';
import CompetencyEvidence from '../models/CompetencyEvidence';
import CompetencySnapshot from '../models/CompetencySnapshot';
import { runCapacityCycle } from '../services/capacityCycleService';

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/capacityconnect');
    console.log('MongoDB Connected...');

    // Clear DB
    await User.deleteMany({});
    await Skill.deleteMany({});
    await RoleRequirement.deleteMany({});
    await CompetencyProfile.deleteMany({});
    await CompetencyEvidence.deleteMany({});
    await CompetencySnapshot.deleteMany({});

    // 1. Create Skills
    const skillList = [
      { name: 'JavaScript', slug: 'javascript', category: 'technical', difficultyLevel: 2, description: 'Core JS' },
      { name: 'TypeScript', slug: 'typescript', category: 'technical', difficultyLevel: 3, description: 'Typed JS' },
      { name: 'React', slug: 'react', category: 'technical', difficultyLevel: 3, description: 'Frontend Library' },
      { name: 'Node.js', slug: 'nodejs', category: 'technical', difficultyLevel: 3, description: 'Backend runtime' },
      { name: 'MongoDB', slug: 'mongodb', category: 'technical', difficultyLevel: 3, description: 'NoSQL DB' },
      { name: 'Cloud Infrastructure', slug: 'cloud', category: 'technical', difficultyLevel: 4, description: 'AWS/GCP/Azure' },
      { name: 'Communication', slug: 'communication', category: 'communication', difficultyLevel: 2, description: 'Team comms' },
      { name: 'Problem Solving', slug: 'problem-solving', category: 'analytical', difficultyLevel: 3, description: 'Algorithmic thinking' }
    ];
    const skills = await Skill.insertMany(skillList);
    const getSkill = (slug: string) => skills.find((s: any) => s.slug === slug)!._id;

    // 2. Create Roles
    const fsRole = await RoleRequirement.create({
      roleName: 'Full Stack Developer',
      skills: [
        { skillId: getSkill('javascript'), requiredLevel: 90, importance: 1, businessDemand: 1 },
        { skillId: getSkill('react'), requiredLevel: 85, importance: 0.9, businessDemand: 0.9 },
        { skillId: getSkill('nodejs'), requiredLevel: 80, importance: 0.9, businessDemand: 0.9 },
        { skillId: getSkill('mongodb'), requiredLevel: 75, importance: 0.8, businessDemand: 0.8 },
        { skillId: getSkill('cloud'), requiredLevel: 60, importance: 0.7, businessDemand: 0.9 },
        { skillId: getSkill('problem-solving'), requiredLevel: 80, importance: 0.8, businessDemand: 0.8 }
      ]
    });

    // 3. Create Users
    const learner1 = await User.create({
      name: 'Rahul Sharma', email: 'rahul@example.com', password: 'password123', role: 'LEARNER',
      profile: { targetRole: fsRole._id.toString() }
    });

    const learner2 = await User.create({
      name: 'Priya Verma', email: 'priya@example.com', password: 'password123', role: 'LEARNER',
      profile: { targetRole: fsRole._id.toString() }
    });

    // 4. Create Initial Profiles
    await CompetencyProfile.create({
      userId: learner1._id, overallScore: 0,
      roleReadiness: { targetRole: fsRole._id.toString(), readinessScore: 0 },
      competencyDNA: { technical: 0, analytical: 0, communication: 0, leadership: 0, creativity: 0 },
      skills: skills.map((s: any) => ({ skillId: s._id, score: 0 }))
    });

    await CompetencyProfile.create({
      userId: learner2._id, overallScore: 0,
      roleReadiness: { targetRole: fsRole._id.toString(), readinessScore: 0 },
      competencyDNA: { technical: 0, analytical: 0, communication: 0, leadership: 0, creativity: 0 },
      skills: skills.map((s: any) => ({ skillId: s._id, score: 0 }))
    });

    // 5. Add Evidence
    await CompetencyEvidence.create({ userId: learner1._id, skillId: getSkill('javascript'), source: 'assessment', score: 85, weight: 1 });
    await CompetencyEvidence.create({ userId: learner1._id, skillId: getSkill('react'), source: 'course', score: 75, weight: 0.8 });
    await CompetencyEvidence.create({ userId: learner1._id, skillId: getSkill('nodejs'), source: 'assessment', score: 40, weight: 1 }); 
    
    await CompetencyEvidence.create({ userId: learner2._id, skillId: getSkill('javascript'), source: 'assessment', score: 92, weight: 1 });
    await CompetencyEvidence.create({ userId: learner2._id, skillId: getSkill('react'), source: 'assessment', score: 88, weight: 1 });
    await CompetencyEvidence.create({ userId: learner2._id, skillId: getSkill('nodejs'), source: 'assessment', score: 85, weight: 1 });
    await CompetencyEvidence.create({ userId: learner2._id, skillId: getSkill('mongodb'), source: 'assessment', score: 80, weight: 1 });
    await CompetencyEvidence.create({ userId: learner2._id, skillId: getSkill('cloud'), source: 'assessment', score: 30, weight: 1 }); 

    // 6. Run Cycle
    await runCapacityCycle(learner1._id.toString(), fsRole._id.toString(), 'manual');
    await runCapacityCycle(learner2._id.toString(), fsRole._id.toString(), 'manual');

    console.log('Database seeded with intelligent data!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
