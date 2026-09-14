import { Response } from 'express';
import prisma from '../config/prisma';
import { AuthRequest } from '../middleware/authMiddleware';

export const createAssessment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, courseId, passingScore, questions, skillMappings } = req.body;
    const trainerId = req.user?.id;
    
    if (req.user?.role !== 'TRAINER') {
      res.status(403).json({ message: 'Only trainers can create assessments' });
      return;
    }
    
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course || course.trainerId !== trainerId) {
      res.status(403).json({ message: 'Unauthorized or course not found' });
      return;
    }
    
    const assessment = await prisma.assessment.create({
      data: {
        title,
        description,
        courseId,
        trainerId: trainerId as string,
        passingScore: passingScore || 70,
        questions: questions || [],
        skillMappings: skillMappings || []
      }
    });
    
    res.status(201).json(assessment);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const submitAttempt = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id: assessmentId } = req.params;
    const { answers } = req.body;
    const learnerId = req.user?.id;
    
    const assessment = await prisma.assessment.findUnique({ where: { id: assessmentId } });
    if (!assessment) {
      res.status(404).json({ message: 'Assessment not found' });
      return;
    }
    
    const enrollment = await prisma.enrollment.findUnique({
      where: { learnerId_courseId: { learnerId: learnerId as string, courseId: assessment.courseId } }
    });
    
    if (!enrollment) {
      res.status(403).json({ message: 'Must be enrolled to submit' });
      return;
    }
    
    const attempt = await prisma.assessmentAttempt.create({
      data: {
        assessmentId,
        learnerId: learnerId as string,
        courseId: assessment.courseId,
        trainerId: assessment.trainerId,
        answers: answers || [],
        status: 'SUBMITTED',
        submittedAt: new Date()
      }
    });
    
    res.status(201).json(attempt);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const gradeAttempt = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { attemptId } = req.params;
    const { score, feedback } = req.body;
    const trainerId = req.user?.id;
    
    const attempt = await prisma.assessmentAttempt.findUnique({ 
      where: { id: attemptId },
      include: { assessment: { include: { course: { include: { courseSkills: { include: { skill: true } } } } } } }
    });
    
    if (!attempt || attempt.trainerId !== trainerId) {
      res.status(403).json({ message: 'Unauthorized' });
      return;
    }
    
    const graded = await prisma.assessmentAttempt.update({
      where: { id: attemptId },
      data: {
        status: 'GRADED',
        score,
        feedback,
        gradedAt: new Date(),
        gradedBy: trainerId as string
      }
    });

    // --- INTEGRATION: COMPETENCY UPDATE ---
    if (score >= (attempt.assessment.passingScore || 0) && attempt.assessment.course) {
      let profile = await prisma.competencyProfile.findUnique({ where: { userId: attempt.learnerId } });
      if (!profile) {
        profile = await prisma.competencyProfile.create({ data: { userId: attempt.learnerId, overallScore: 50, readinessScore: 50 } });
      }

      const boost = (score / 100) * 5; 
      const newScore = Math.min(Math.round(profile.overallScore + boost), 100);

      await prisma.competencyProfile.update({
        where: { id: profile.id },
        data: { overallScore: newScore }
      });
      
      const { getIO } = require('../socket');
      const io = getIO();
      if (io) {
          io.to(`user:${attempt.learnerId}`).emit('competency:updated', { newScore });
          
          // Also emit notification
          io.to(`user:${attempt.learnerId}`).emit('notification:new', {
              id: 'notif-' + attemptId,
              title: 'Assessment Graded',
              message: `Your assessment for ${attempt.assessment.title} was graded: ${score}%. Your capability score improved!`,
              type: 'SUCCESS',
              read: false,
              createdAt: new Date()
          });
      }
    }
    
    res.json(graded);
  } catch (error) {
    console.error('gradeAttempt error', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getAssessments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const trainerId = req.user?.id;
    if (!trainerId) {
      res.status(403).json({ message: 'Unauthorized' });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
    const skip = (page - 1) * limit;

    const [assessments, total] = await Promise.all([
      prisma.assessment.findMany({
        where: { trainerId },
        skip,
        take: limit,
        include: { course: { select: { title: true } } },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.assessment.count({ where: { trainerId } })
    ]);
    
    res.json({
      data: assessments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: skip + limit < total,
        hasPreviousPage: page > 1
      }
    });
  } catch (error) {
    console.error('getAssessments error', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
