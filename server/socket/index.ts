import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

let ioInstance: Server | null = null;

export const initializeSocket = (io: Server) => {
  ioInstance = io;

  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth?.token;
    
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { user: { id: string, role: string } };
      // Attach user info to socket
      (socket as any).user = decoded.user;
      next();
    } catch (err) {
      return next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const user = (socket as any).user;
    
    // Join user-specific room
    socket.join(`user:${user.id}`);
    
    // Join role-specific room
    socket.join(`role:${user.role}`);

    console.log(`Socket connected: ${socket.id}, User: ${user.id}, Role: ${user.role}`);

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
