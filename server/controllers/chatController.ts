import { Response } from 'express';
import prisma from '../config/prisma';
import { AuthRequest } from '../middleware/authMiddleware';

export const getConversations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    const isTrainer = req.user?.role === 'TRAINER';
    
    const conversations = await prisma.conversation.findMany({
      where: isTrainer ? { trainerId: userId } : { learnerId: userId },
      include: {
        learner: { select: { id: true, name: true, avatar: true } },
        trainer: { select: { id: true, name: true, avatar: true } },
        relatedCourses: { include: { course: { select: { id: true, title: true } } } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
    
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getOrCreateConversation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { targetId, courseId } = req.body;
    const isTrainer = req.user?.role === 'TRAINER';
    
    const learnerId = isTrainer ? targetId : userId;
    const trainerId = isTrainer ? userId : targetId;
    
    const enrollment = await prisma.enrollment.findUnique({
      where: { learnerId_courseId: { learnerId: learnerId as string, courseId } }
    });
    
    if (!enrollment || (enrollment.status !== 'ENROLLED' && enrollment.status !== 'IN_PROGRESS' && enrollment.status !== 'COMPLETED')) {
      res.status(403).json({ message: 'Not authorized to chat. Valid enrollment required.' });
      return;
    }
    
    let conv = await prisma.conversation.findUnique({
      where: { learnerId_trainerId: { learnerId: learnerId as string, trainerId: trainerId as string } }
    });
    
    if (!conv) {
      conv = await prisma.conversation.create({
        data: {
          learnerId: learnerId as string,
          trainerId: trainerId as string,
          relatedCourses: {
            create: [{ courseId }]
          }
        }
      });
    } else {
      const link = await prisma.conversationCourse.findUnique({
        where: { conversationId_courseId: { conversationId: conv.id, courseId } }
      });
      if (!link) {
        await prisma.conversationCourse.create({
          data: { conversationId: conv.id, courseId }
        });
      }
    }
    
    res.json(conv);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    const conversation = await prisma.conversation.findUnique({ where: { id } });
    
    if (!conversation || (conversation.learnerId !== userId && conversation.trainerId !== userId)) {
      res.status(403).json({ message: 'Unauthorized' });
      return;
    }
    
    const messages = await prisma.message.findMany({
      where: { conversationId: id },
      orderBy: { createdAt: 'asc' }
    });
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
