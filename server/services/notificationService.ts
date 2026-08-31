import mongoose from 'mongoose';
import Notification from '../models/Notification';
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
      // 1. Create Notification in MongoDB
      const notification = await Notification.create({
        ...data,
        recipient: new mongoose.Types.ObjectId(data.recipient),
        ...(data.relatedEntityId && { relatedEntityId: new mongoose.Types.ObjectId(data.relatedEntityId) })
      });

      // 2. Emit Socket.IO event to specific user room
      const io = getIO();
      io.to(`user:${data.recipient}`).emit('notification:new', notification);

      // 3. Emit count update
      const unreadCount = await Notification.countDocuments({ recipient: data.recipient, isRead: false });
      io.to(`user:${data.recipient}`).emit('notification:count_updated', { unreadCount });

      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  markAsRead: async (notificationId: string, userId: string) => {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { isRead: true, readAt: new Date() },
      { new: true }
    );
    return notification;
  },

  markAllAsRead: async (userId: string) => {
    await Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );
  },

  deleteNotification: async (notificationId: string, userId: string) => {
    const notification = await Notification.findOneAndDelete({ _id: notificationId, recipient: userId });
    return notification;
  }
};
