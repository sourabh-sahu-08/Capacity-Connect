import { Response } from 'express';
import prisma from '../config/prisma';
import { AuthRequest } from '../middleware/authMiddleware';

export const createCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, category, difficulty, duration, thumbnail, learningOutcomes, prerequisites } = req.body;
    
    if (!req.user || !req.user.id || req.user.role !== 'TRAINER') {
      res.status(403).json({ message: 'Only trainers can create courses.' });
      return;
    }

    const newCourse = await prisma.course.create({
      data: {
        title,
        description,
        category,
        difficulty,
        duration,
        thumbnail,
        status: 'DRAFT',
        learningOutcomes: learningOutcomes || [],
        prerequisites: prerequisites || [],
        trainerId: req.user.id
      }
    });

    res.status(201).json(newCourse);
  } catch (error) {
    console.error('Create Course Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const course = await prisma.course.findUnique({ where: { id } });
    
    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }
    
    if (course.trainerId !== req.user?.id) {
      res.status(403).json({ message: 'Unauthorized' });
      return;
    }

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: updateData
    });

    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const publishCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const course = await prisma.course.findUnique({ 
      where: { id },
      include: { courseSkills: true, modules: { include: { lessons: true } } }
    });
    
    if (!course || course.trainerId !== req.user?.id) {
      res.status(403).json({ message: 'Unauthorized' });
      return;
    }
    
    // Validations
    if (!course.title || !course.description) {
      res.status(400).json({ message: 'Course must have a title and description.' });
      return;
    }
    if (course.courseSkills.length === 0) {
      res.status(400).json({ message: 'Course must have at least one mapped skill.' });
      return;
    }
    if (course.modules.length === 0 || course.modules[0].lessons.length === 0) {
      res.status(400).json({ message: 'Course must have at least one module and lesson.' });
      return;
    }

    const published = await prisma.course.update({
      where: { id },
      data: { status: 'PUBLISHED' }
    });

    res.json(published);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getCourses = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let query: any = { status: 'PUBLISHED' };
    
    if (req.query.myCourses === 'true' && req.user?.role === 'TRAINER') {
      query = { trainerId: req.user.id };
    }

    const courses = await prisma.course.findMany({ 
      where: query, 
      include: { 
        trainer: { select: { name: true, avatar: true } },
        courseSkills: { include: { skill: true } }
      }, 
      orderBy: { createdAt: 'desc' } 
    });
      
    res.json(courses);
  } catch (error) {
    console.error('getCourses Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getCourseById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const course = await prisma.course.findUnique({ 
      where: { id },
      include: { 
        trainer: { select: { name: true, avatar: true, bio: true } },
        courseSkills: { include: { skill: true } },
        modules: { include: { lessons: { orderBy: { order: 'asc' } } }, orderBy: { order: 'asc' } },
        assessments: true
      }
    });
    
    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }
    
    if (course.status !== 'PUBLISHED' && course.trainerId !== req.user?.id) {
      res.status(403).json({ message: 'Unauthorized' });
      return;
    }
      
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getRecommendedCourses = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const learnerId = req.user?.id;
    if (!learnerId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    const profile = await prisma.competencyProfile.findUnique({
      where: { userId: learnerId },
      include: { skills: { include: { skill: true } } }
    });
    
    if (!profile) {
      const courses = await prisma.course.findMany({ where: { status: 'PUBLISHED' }, take: 5, include: { trainer: { select: { name: true } }, courseSkills: { include: { skill: true } } } });
      res.json(courses.map(c => ({ course: c, matchedSkills: [], recommendationScore: 0, reason: 'Newest course' })));
      return;
    }
    
    const gaps = profile.skills.filter(ps => ps.score < 80);
    const gapSkillIds = gaps.map(g => g.skillId);
    
    const courses = await prisma.course.findMany({
      where: {
        status: 'PUBLISHED',
        courseSkills: {
          some: {
            skillId: { in: gapSkillIds }
          }
        },
        NOT: {
          enrollments: {
            some: {
              learnerId: learnerId,
              status: { in: ['COMPLETED', 'IN_PROGRESS'] }
            }
          }
        }
      },
      include: {
        trainer: { select: { name: true } },
        courseSkills: { include: { skill: true } }
      }
    });
    
    const recommended = courses.map(course => {
      let score = 0;
      let matched: string[] = [];
      course.courseSkills.forEach(cs => {
        const learnerSkill = gaps.find(g => g.skillId === cs.skillId);
        if (learnerSkill) {
          const gapSeverity = 100 - learnerSkill.score;
          const importanceMul = cs.importance === 'HIGH' ? 1.5 : (cs.importance === 'MEDIUM' ? 1.2 : 1);
          score += gapSeverity * importanceMul;
          matched.push(cs.skill.name);
        }
      });
      
      return {
        course,
        matchedSkills: matched,
        recommendationScore: score,
        reason: `Recommended because ${matched.join(', ')} is one of your skill gaps.`
      };
    });
    
    recommended.sort((a, b) => b.recommendationScore - a.recommendationScore);
    res.json(recommended);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
