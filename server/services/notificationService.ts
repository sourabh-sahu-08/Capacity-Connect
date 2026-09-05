import prisma from '../config/prisma';
import { getIO } from '../socket';

export const NotificationService = {
  createNotification: async (data: {
    recipient: string;
    role: string;
    type: string;
    title: string;
    message: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    category: string;
    relatedEntityType?: string;
    relatedEntityId?: string;
    actionUrl?: string;
  }) => {
    try {
      // 1. Create Notification in PostgreSQL
      const notification = await prisma.notification.create({
        data: {
          recipientId: data.recipient,
          role: data.role,
          type: data.type,
          title: data.title,
          message: data.message,
          priority: data.priority || 'LOW',
          category: data.category,
          relatedEntityType: data.relatedEntityType,
          relatedEntityId: data.relatedEntityId,
          actionUrl: data.actionUrl,
        }
      });

      // 2. Emit Socket.IO event to specific user room
      const io = getIO();
      io.to(`user:${data.recipient}`).emit('notification:new', notification);

      // 3. Emit count update
      const unreadCount = await prisma.notification.count({ where: { recipientId: data.recipient, isRead: false } });
      io.to(`user:${data.recipient}`).emit('notification:count_updated', { unreadCount });

      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  markAsRead: async (notificationId: string, userId: string) => {
    const notification = await prisma.notification.updateMany({
      where: { id: notificationId, recipientId: userId },
      data: { isRead: true, readAt: new Date() }
    });
    if (notification.count === 0) return null;
    return prisma.notification.findUnique({ where: { id: notificationId } });
  },

  markAllAsRead: async (userId: string) => {
    await prisma.notification.updateMany({
      where: { recipientId: userId, isRead: false },
      data: { isRead: true, readAt: new Date() }
    });
  },

  deleteNotification: async (notificationId: string, userId: string) => {
    try {
      const notification = await prisma.notification.findFirst({ where: { id: notificationId, recipientId: userId } });
      if (!notification) return null;
      await prisma.notification.delete({ where: { id: notificationId } });
      return notification;
    } catch {
      return null;
    }
  }
};
