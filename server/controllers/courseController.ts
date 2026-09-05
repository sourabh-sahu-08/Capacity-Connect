import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { AuthRequest } from '../middleware/authMiddleware';

export const createCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, status, targetCompetencies } = req.body;
    
    if (!req.user || !req.user.id) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const newCourse = await prisma.course.create({ data: { title, description, status: status || 'Active', targetCompetencies: targetCompetencies || [], trainerId: req.user.id } });

    res.status(201).json({ ...newCourse, _id: newCourse.id });
  } catch (error) {
    console.error('Create Course Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getCourses = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user.id) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // If query contains ?myCourses=true, return only courses by this trainer
    let query: any = { status: 'Active' };
    if (req.query.myCourses === 'true') {
      query = { trainerId: req.user.id };
    }

    const courses = await prisma.course.findMany({ where: query, include: { trainer: { select: { name: true } } }, orderBy: { createdAt: 'desc' } });
      
    res.json(courses.map(c => ({ ...c, _id: c.id })));
  } catch (error) {
    console.error('Get Courses Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
