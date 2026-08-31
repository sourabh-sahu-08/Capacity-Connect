import { Request, Response } from 'express';
import User from '../models/User';
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
    
    if (!req.user || !req.user._id) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          'profile.learningGoal': learningGoal,
          'profile.currentRole': currentRole,
          'profile.targetRole': targetRole,
          'profile.experienceLevel': experienceLevel,
          learnerAssessmentCompleted: true
        }
      },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Onboarding completed successfully',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during onboarding' });
  }
};
