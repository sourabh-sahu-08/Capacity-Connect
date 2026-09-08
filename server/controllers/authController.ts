import prisma from '../config/prisma';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sign, verify } from 'jsonwebtoken';
import { Role } from 'shared';
import { sendEmail } from '../services/emailService';
import { NotificationService } from '../services/notificationService';

const generateToken = (id: string, role: string, rememberMe: boolean = false) => {
  return sign({ id, role }, process.env.JWT_SECRET || 'secret', {
    expiresIn: rememberMe ? '30d' : '1d',
  });
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role, organization } = req.body;

    // Prevent public admin registration
    if (role === Role.ADMIN) {
      res.status(403).json({ message: 'Unauthorized role assignment' });
      return;
    }

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    
    const user = await prisma.user.create({ data: { name, email, password: hashedPassword, role: role || Role.LEARNER, organization } });
    
    // Notify Admins
    try {
      const admins = await prisma.user.findMany({ where: { role: Role.ADMIN } });
      for (const admin of admins) {
        await NotificationService.createNotification({
          recipient: admin.id,
          role: Role.ADMIN,
          type: 'new_user_registered',
          title: 'New User Registered',
          message: `${name} (${email}) just registered as a ${role || Role.LEARNER}.`,
          priority: 'LOW',
          category: 'System'
        });
      }
    } catch (e) {
      console.error('Failed to send admin notification', e);
    }
  

    await prisma.competencyProfile.create({ data: { userId: user.id, overallScore: 0, dnaTechnical: 0, dnaAnalytical: 0, dnaCommunication: 0, dnaLeadership: 0, dnaCreativity: 0, readinessScore: 0 } });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileCompleted: user.profileCompleted,
        learnerAssessmentCompleted: user.learnerAssessmentCompleted,
        trainerOnboardingCompleted: user.trainerOnboardingCompleted,
        token: generateToken(user.id, user.role, true),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, rememberMe } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileCompleted: user.profileCompleted,
        learnerAssessmentCompleted: user.learnerAssessmentCompleted,
        trainerOnboardingCompleted: user.trainerOnboardingCompleted,
        token: generateToken(user.id, user.role, rememberMe),
      });
    } else {
      res.status(401).json({ message: 'The email or password you entered is incorrect. Try again.' });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: (req as any).user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profileCompleted: true,
        learnerAssessmentCompleted: true,
        trainerOnboardingCompleted: true,
        organization: true,
        avatar: true,
        bio: true,
        currentRole: true,
        targetRole: true,
        learningGoal: true,
        experienceLevel: true,
        githubUrl: true,
        linkedinUrl: true,
        twitterUrl: true,
        websiteUrl: true,
        location: true,
        skillsList: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.json(user);
  } catch (error) {
    console.error('GetMe Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { 
      name, 
      organization, 
      avatar, 
      bio, 
      currentRole, 
      targetRole, 
      learningGoal, 
      experienceLevel,
      githubUrl,
      linkedinUrl,
      twitterUrl,
      websiteUrl,
      location,
      skillsList
    } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name !== undefined && { name }),
        ...(organization !== undefined && { organization }),
        ...(avatar !== undefined && { avatar }),
        ...(bio !== undefined && { bio }),
        ...(currentRole !== undefined && { currentRole }),
        ...(targetRole !== undefined && { targetRole }),
        ...(learningGoal !== undefined && { learningGoal }),
        ...(experienceLevel !== undefined && { experienceLevel }),
        ...(githubUrl !== undefined && { githubUrl }),
        ...(linkedinUrl !== undefined && { linkedinUrl }),
        ...(twitterUrl !== undefined && { twitterUrl }),
        ...(websiteUrl !== undefined && { websiteUrl }),
        ...(location !== undefined && { location }),
        ...(skillsList !== undefined && { skillsList: Array.isArray(skillsList) ? skillsList : [] }),
        profileCompleted: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profileCompleted: true,
        learnerAssessmentCompleted: true,
        trainerOnboardingCompleted: true,
        organization: true,
        avatar: true,
        bio: true,
        currentRole: true,
        targetRole: true,
        learningGoal: true,
        experienceLevel: true,
        githubUrl: true,
        linkedinUrl: true,
        twitterUrl: true,
        websiteUrl: true,
        location: true,
        skillsList: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ message: 'Server Error while updating profile' });
  }
};

export const updatePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Current password is incorrect' });
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      res.status(400).json({ message: 'New password must be at least 8 characters long' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Update Password Error:', error);
    res.status(500).json({ message: 'Server Error while updating password' });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    // Always return success even if user not found, to prevent email enumeration
    const successMsg = 'If an account exists with this email, password reset instructions have been sent.';

    if (!user) {
      res.json({ success: true, message: successMsg });
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const expireTime = Date.now() + 15 * 60 * 1000; // 15 mins

    await prisma.user.update({ where: { id: user.id }, data: { resetPasswordToken: hashedToken, resetPasswordExpire: new Date(expireTime) } });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: 'Capacity Connect - Password Reset Request',
      text: `You requested a password reset. Please go to this link to reset your password: 

 ${resetUrl}

 This link expires in 15 minutes.`
    });

    res.json({ success: true, message: successMsg });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    
    const user = await prisma.user.findFirst({ where: { resetPasswordToken: hashedToken, resetPasswordExpire: { gt: new Date() } } });

    if (!user) {
      res.status(400).json({ success: false, message: 'Invalid or expired reset token.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(password, salt);

    await prisma.user.update({ where: { id: user.id }, data: { password: newHashedPassword, resetPasswordToken: null, resetPasswordExpire: null } });

    res.json({ success: true, message: 'Password reset successfully.' });
  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
