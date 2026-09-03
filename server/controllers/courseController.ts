import { Request, Response } from 'express';
import Course from '../models/Course';
import { AuthRequest } from '../middleware/authMiddleware';

export const createCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, status, targetCompetencies } = req.body;
    
    if (!req.user || !req.user._id) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const newCourse = await Course.create({
      title,
      description,
      status: status || 'Active',
      targetCompetencies: targetCompetencies || [],
      trainerId: req.user._id
    });

    res.status(201).json(newCourse);
  } catch (error) {
    console.error('Create Course Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getCourses = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user._id) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const courses = await Course.find({ trainerId: req.user._id }).sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    console.error('Get Courses Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
