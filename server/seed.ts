import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedDatabase() {
  console.log('Clearing database...');
  // Delete in reverse order of dependencies
  await prisma.message.deleteMany();
  await prisma.conversationCourse.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.assessmentAttempt.deleteMany();
  await prisma.assessment.deleteMany();
  await prisma.lessonProgress.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.courseSkill.deleteMany();
  await prisma.course.deleteMany();
  await prisma.competencySnapshot.deleteMany();
  await prisma.competencyEvidence.deleteMany();
  await prisma.profileSkill.deleteMany();
  await prisma.competencyProfile.deleteMany();
  await prisma.roleSkill.deleteMany();
  await prisma.roleRequirement.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.insightEvent.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.user.deleteMany();

  console.log('Creating Users...');
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);

  const trainerA = await prisma.user.create({
    data: {
      name: 'Trainer A',
      email: 'trainera@example.com',
      password: hashedPassword,
      role: 'TRAINER',
    },
  });

  const trainerB = await prisma.user.create({
    data: {
      name: 'Trainer B',
      email: 'trainerb@example.com',
      password: hashedPassword,
      role: 'TRAINER',
    },
  });

  const learnerA = await prisma.user.create({
    data: {
      name: 'Learner A',
      email: 'learnerA@example.com',
      password: hashedPassword,
      role: 'LEARNER',
    },
  });

  const learnerB = await prisma.user.create({
    data: {
      name: 'Learner B',
      email: 'learnerB@example.com',
      password: hashedPassword,
      role: 'LEARNER',
    },
  });

  console.log('Creating Skills...');
  const skillReact = await prisma.skill.create({
    data: { name: 'React', slug: 'react', category: 'Frontend', description: 'React Library', difficultyLevel: 2 },
  });
  const skillJS = await prisma.skill.create({
    data: { name: 'JavaScript', slug: 'javascript', category: 'Language', description: 'JS Language', difficultyLevel: 2 },
  });
  const skillNode = await prisma.skill.create({
    data: { name: 'Node.js', slug: 'nodejs', category: 'Backend', description: 'Node.js Runtime', difficultyLevel: 3 },
  });
  const skillExpress = await prisma.skill.create({
    data: { name: 'Express', slug: 'express', category: 'Backend', description: 'Express Framework', difficultyLevel: 2 },
  });

  console.log('Creating Learner Competency Profiles...');
  await prisma.competencyProfile.create({
    data: {
      userId: learnerA.id,
      overallScore: 40,
      skills: {
        create: [
          { skillId: skillReact.id, score: 20 }, // Gap!
          { skillId: skillJS.id, score: 50 },
        ],
      },
    },
  });

  console.log('Creating Courses...');
  const reactCourse = await prisma.course.create({
    data: {
      title: 'React Fundamentals',
      description: 'Learn the basics of React',
      trainerId: trainerA.id,
      status: 'PUBLISHED',
      category: 'Frontend',
      difficulty: 'Beginner',
      duration: 120,
      courseSkills: {
        create: [
          { skillId: skillReact.id, importance: 'HIGH', targetLevel: 80 },
          { skillId: skillJS.id, importance: 'MEDIUM', targetLevel: 70 },
        ],
      },
      modules: {
        create: [
          {
            title: 'Module 1: Introduction',
            order: 1,
            lessons: {
              create: [
                { title: 'What is React?', duration: 10, order: 1 },
                { title: 'Components', duration: 20, order: 2 },
              ],
            },
          },
        ],
      },
      assessments: {
        create: [
          {
            title: 'React Basics Assessment',
            trainerId: trainerA.id,
            passingScore: 70,
            availability: 'AVAILABLE',
          },
        ],
      },
    },
    include: { modules: { include: { lessons: true } }, assessments: true },
  });

  const nodeCourse = await prisma.course.create({
    data: {
      title: 'Node.js Backend',
      description: 'Learn backend with Node',
      trainerId: trainerB.id,
      status: 'PUBLISHED',
      category: 'Backend',
      difficulty: 'Intermediate',
      courseSkills: {
        create: [
          { skillId: skillNode.id, importance: 'HIGH', targetLevel: 85 },
          { skillId: skillExpress.id, importance: 'HIGH', targetLevel: 80 },
        ],
      },
    },
  });

  console.log('Creating Enrollments...');
  await prisma.enrollment.create({
    data: {
      learnerId: learnerA.id,
      courseId: reactCourse.id,
      trainerId: trainerA.id,
      status: 'IN_PROGRESS',
      progress: 50,
      startedAt: new Date(),
      lastActivityAt: new Date(),
    },
  });

  await prisma.lessonProgress.create({
    data: {
      learnerId: learnerA.id,
      lessonId: reactCourse.modules[0].lessons[0].id,
      courseId: reactCourse.id,
      completed: true,
      completedAt: new Date(),
      timeSpent: 600,
    },
  });

  console.log('Creating Assessment Attempts...');
  await prisma.assessmentAttempt.create({
    data: {
      assessmentId: reactCourse.assessments[0].id,
      learnerId: learnerA.id,
      courseId: reactCourse.id,
      trainerId: trainerA.id,
      status: 'SUBMITTED',
      submittedAt: new Date(),
    },
  });

  console.log('Creating Conversations...');
  const conversation = await prisma.conversation.create({
    data: {
      learnerId: learnerA.id,
      trainerId: trainerA.id,
      lastMessagePreview: 'I do not understand React Hooks.',
      lastMessageAt: new Date(),
      relatedCourses: {
        create: [{ courseId: reactCourse.id }],
      },
      messages: {
        create: [
          {
            senderId: learnerA.id,
            content: 'I do not understand React Hooks.',
          },
        ],
      },
    },
  });

  console.log('Seeding completed successfully.');
}

seedDatabase()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
