import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { AuthRequest } from '../middleware/authMiddleware';

export const createAssessment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, courseId, type, maxScore, status } = req.body;
    
    if (!req.user || !req.user.id) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Verify course belongs to trainer
    const course = await prisma.course.findFirst({ where: { id: courseId, trainerId: req.user.id } });
    if (!course) {
      res.status(404).json({ message: 'Course not found or unauthorized' });
      return;
    }

    const newAssessment = await prisma.assessment.create({ data: { title, courseId, trainerId: req.user.id, type: type || 'Project', maxScore: Number(maxScore) || 100, status: status || 'Active' }, include: { course: { select: { title: true } } } });

    

    res.status(201).json({ ...newAssessment, _id: newAssessment.id, courseId: newAssessment.course });
  } catch (error) {
    console.error('Create Assessment Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getAssessments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user.id) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const assessments = await prisma.assessment.findMany({ where: { trainerId: req.user.id }, include: { course: { select: { title: true } } }, orderBy: { createdAt: 'desc' } });
      
    const mappedAssessments = assessments.map(a => ({ ...a, _id: a.id, courseId: a.course }));
    res.json(mappedAssessments);
  } catch (error) {
    console.error('Get Assessments Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
