import { Request, Response } from 'express';
import prisma from '../config/prisma';
interface AuthRequest extends Request {
  user?: any;
}

export const getOptions = async (req: Request, res: Response): Promise<void> => {
  try {
    // Return standard options for the onboarding wizard
    res.json({
      success: true,
      data: {
        learningGoals: [
          'Improve my current skills',
          'Prepare for a new role',
          'Explore a new domain',
          'Develop leadership skills'
        ],
        roles: [
          'Frontend Developer',
          'Backend Developer',
          'Full Stack Developer',
          'Data Analyst',
          'UI/UX Designer',
          'Project Manager'
        ],
        experienceLevels: [
          'Beginner',
          'Intermediate',
          'Advanced'
        ]
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const completeOnboarding = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { learningGoal, currentRole, targetRole, experienceLevel } = req.body;
    
    if (!req.user || !req.user.id) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const updatedUser = await prisma.user.update({ where: { id: req.user.id }, data: { learningGoal, currentRole, targetRole, experienceLevel, learnerAssessmentCompleted: true }, select: { id: true, name: true, email: true, role: true, profileCompleted: true, learnerAssessmentCompleted: true, trainerOnboardingCompleted: true, organization: true } });

    res.json({
      success: true,
      message: 'Onboarding completed successfully',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during onboarding' });
  }
};

export const completeTrainerOnboarding = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user.id) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const updatedUser = await prisma.user.update({ where: { id: req.user.id }, data: { trainerOnboardingCompleted: true }, select: { id: true, name: true, email: true, role: true, profileCompleted: true, learnerAssessmentCompleted: true, trainerOnboardingCompleted: true, organization: true } });

    res.json({
      success: true,
      message: 'Trainer onboarding completed successfully',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during onboarding' });
  }
};
