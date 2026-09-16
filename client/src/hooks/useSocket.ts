import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

let socketInstance: Socket | null = null;
let connectionCount = 0;

export const useSocket = (token: string | null) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) return;

    if (!socketInstance) {
      socketInstance = io(SOCKET_URL, {
        auth: { token },
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });
      
      socketInstance.on('connect', () => {
        console.log('Socket.IO connected globally', socketInstance?.id);
      });

      socketInstance.on('disconnect', () => {
        console.log('Socket.IO disconnected globally');
      });
    }

    socketRef.current = socketInstance;
    connectionCount++;

    return () => {
      connectionCount--;
      // Wait a moment before actually disconnecting to prevent thrashing during navigation
      setTimeout(() => {
        if (connectionCount === 0 && socketInstance) {
          socketInstance.disconnect();
          socketInstance = null;
        }
      }, 500);
    };
  }, [token]);

  return socketInstance;
};
