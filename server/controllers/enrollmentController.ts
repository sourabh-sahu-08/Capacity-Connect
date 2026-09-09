import { Response } from 'express';
import prisma from '../config/prisma';
import { AuthRequest } from '../middleware/authMiddleware';
import { getIO } from '../socket';

export const enroll = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id: courseId } = req.params;
    const learnerId = req.user?.id;
    
    if (!learnerId || req.user?.role !== 'LEARNER') {
      res.status(403).json({ message: 'Only learners can enroll' });
      return;
    }
    
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course || course.status !== 'PUBLISHED') {
      res.status(400).json({ message: 'Course not available' });
      return;
    }
    
    const existing = await prisma.enrollment.findUnique({
      where: { learnerId_courseId: { learnerId, courseId } }
    });
    
    if (existing) {
      res.status(400).json({ message: 'Already enrolled' });
      return;
    }
    
    const enrollment = await prisma.enrollment.create({
      data: {
        learnerId,
        courseId,
        trainerId: course.trainerId,
        status: 'ENROLLED',
        startedAt: new Date(),
        lastActivityAt: new Date()
      }
    });
    
    // Notify trainer
    const io = getIO();
    io.to(`user:${course.trainerId}`).emit('notification:new', {
      title: 'New Enrollment',
      message: 'A new learner has enrolled in your course.'
    });

    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getMyEnrollments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const learnerId = req.user?.id;
    const enrollments = await prisma.enrollment.findMany({
      where: { learnerId },
      include: {
        course: { include: { trainer: { select: { name: true } } } }
      },
      orderBy: { lastActivityAt: 'desc' }
    });
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateLessonProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { enrollmentId } = req.params;
    const { lessonId, completed, timeSpent } = req.body;
    const learnerId = req.user?.id;
    
    const enrollment = await prisma.enrollment.findUnique({ where: { id: enrollmentId }, include: { course: { include: { modules: { include: { lessons: true } } } } } });
    
    if (!enrollment || enrollment.learnerId !== learnerId) {
      res.status(403).json({ message: 'Unauthorized' });
      return;
    }
    
    await prisma.lessonProgress.upsert({
      where: { learnerId_lessonId: { learnerId: learnerId as string, lessonId } },
      update: { completed, timeSpent: { increment: timeSpent || 0 }, completedAt: completed ? new Date() : null },
      create: { learnerId: learnerId as string, lessonId, courseId: enrollment.courseId, completed, completedAt: completed ? new Date() : null, timeSpent: timeSpent || 0 }
    });
    
    const allLessonsCount = enrollment.course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);
    const completedLessonsCount = await prisma.lessonProgress.count({ where: { learnerId: learnerId as string, courseId: enrollment.courseId, completed: true } });
    
    const progress = allLessonsCount > 0 ? (completedLessonsCount / allLessonsCount) * 100 : 0;
    
    const updated = await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: { progress, lastActivityAt: new Date(), status: progress >= 100 ? 'COMPLETED' : 'IN_PROGRESS' }
    });
    
    const io = getIO();
    io.to(`user:${enrollment.trainerId}`).emit('course:progress_updated', {
      courseId: enrollment.courseId,
      learnerId,
      progress,
      lastActivityAt: updated.lastActivityAt
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getLearnersForTrainer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const trainerId = req.user?.id;
    if (!trainerId) return;
    
    const enrollments = await prisma.enrollment.findMany({
      where: { trainerId },
      include: {
        learner: { select: { id: true, name: true, avatar: true } },
        course: { select: { title: true } }
      },
      orderBy: { lastActivityAt: 'desc' }
    });
    
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
