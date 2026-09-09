import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';

let ioInstance: Server | null = null;

export const initializeSocket = (io: Server) => {
  ioInstance = io;

  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth?.token;
    
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string, role: string };
      (socket as any).user = { id: decoded.id, role: decoded.role };
      next();
    } catch (err) {
      return next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const user = (socket as any).user;
    
    socket.join(`user:${user.id}`);
    socket.join(`role:${user.role}`);
    console.log(`Socket connected: ${socket.id}, User: ${user.id}`);

    // Chat events
    socket.on('conversation:join', async (conversationId: string) => {
      // Validate participant
      try {
        const conv = await prisma.conversation.findUnique({ where: { id: conversationId } });
        if (conv && (conv.learnerId === user.id || conv.trainerId === user.id)) {
          socket.join(`conversation:${conversationId}`);
        }
      } catch (err) {
        console.error(err);
      }
    });

    socket.on('conversation:leave', (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`);
    });

    socket.on('message:send', async (data: { conversationId: string; content: string }) => {
      try {
        const conv = await prisma.conversation.findUnique({ where: { id: data.conversationId } });
        if (!conv || (conv.learnerId !== user.id && conv.trainerId !== user.id)) return;
        
        // Save message
        const message = await prisma.message.create({
          data: {
            conversationId: data.conversationId,
            senderId: user.id,
            content: data.content
          }
        });
        
        // Update conversation
        await prisma.conversation.update({
          where: { id: data.conversationId },
          data: { lastMessagePreview: data.content.substring(0, 50), lastMessageAt: new Date() }
        });
        
        // Broadcast
        io.to(`conversation:${data.conversationId}`).emit('message:new', message);
        
        // Notify recipient if not in room (can be handled via NotificationService)
        const recipientId = conv.learnerId === user.id ? conv.trainerId : conv.learnerId;
        io.to(`user:${recipientId}`).emit('notification:new', {
          title: 'New Message',
          message: `You have a new message from ${user.role}`
        });
      } catch (err) {
        console.error('message:send error', err);
      }
    });

    socket.on('message:read', async (data: { messageIds: string[] }) => {
      try {
        await prisma.message.updateMany({
          where: { id: { in: data.messageIds }, senderId: { not: user.id } },
          data: { readAt: new Date() }
        });
        // We can emit message:read back if needed
      } catch (err) {}
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

export const getIO = () => {
  if (!ioInstance) {
    throw new Error('Socket.io has not been initialized!');
  }
  return ioInstance;
};
