import { Request, Response } from 'express';
import Assessment from '../models/Assessment';
import Course from '../models/Course';
import { AuthRequest } from '../middleware/authMiddleware';

export const createAssessment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, courseId, type, maxScore, status } = req.body;
    
    if (!req.user || !req.user._id) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Verify course belongs to trainer
    const course = await Course.findOne({ _id: courseId, trainerId: req.user._id });
    if (!course) {
      res.status(404).json({ message: 'Course not found or unauthorized' });
      return;
    }

    const newAssessment = await Assessment.create({
      title,
      courseId,
      trainerId: req.user._id,
      type: type || 'Project',
      maxScore: maxScore || 100,
      status: status || 'Active'
    });

    // Populate course details for the response
    await newAssessment.populate('courseId', 'title');

    res.status(201).json(newAssessment);
  } catch (error) {
    console.error('Create Assessment Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getAssessments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user._id) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const assessments = await Assessment.find({ trainerId: req.user._id })
      .populate('courseId', 'title')
      .sort({ createdAt: -1 });
      
    res.json(assessments);
  } catch (error) {
    console.error('Get Assessments Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
