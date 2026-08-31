// @ts-nocheck
import React, { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';
import { useNotificationStore } from '../../features/notifications/notificationStore';
import type { Notification } from './notificationStore';
import { useAuthStore } from '../../store/authStore';
import { NotificationToast } from '../../components/notifications/NotificationToast';
import { AnimatePresence } from 'framer-motion';

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const { token, isAuthenticated } = useAuthStore();
  const socketRef = useRef<Socket | null>(null);
  const [activeToast, setActiveToast] = useState<Notification | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    setNotifications,
    addNotification,
    setUnreadCount,
    incrementUnreadCount,
    setSocketConnected,
    reset
  } = useNotificationStore();

  const fetchInitialData = async () => {
    if (!token) return;
    try {
      const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      const [notifsRes, countRes] = await Promise.all([
        axios.get(`${apiURL}/api/notifications?limit=10`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${apiURL}/api/notifications/unread-count`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setNotifications(notifsRes.data.notifications);
      setUnreadCount(countRes.data.unreadCount);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchInitialData();

      const socketURL = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      socketRef.current = io(socketURL, {
        auth: { token },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });

      const socket = socketRef.current;

      socket.on('connect', () => {
        setSocketConnected(true);
        // On reconnection, we might have missed events. Re-sync via REST.
        fetchInitialData();
      });

      socket.on('disconnect', () => {
        setSocketConnected(false);
      });

      socket.on('notification:new', (notification: Notification) => {
        addNotification(notification);
        
        // Show Toast for medium+ priorities
        if (['MEDIUM', 'HIGH', 'CRITICAL'].includes(notification.priority)) {
          setActiveToast(notification);
          if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
          toastTimeoutRef.current = setTimeout(() => {
            setActiveToast(null);
          }, 5000);
        }
      });

      socket.on('notification:count_updated', (data: { unreadCount: number }) => {
        setUnreadCount(data.unreadCount);
      });

      return () => {
        if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
        socket.disconnect();
        reset();
      };
    } else {
      // User logged out
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      reset();
    }
  }, [isAuthenticated, token]);

  return (
    <>
      {children}
      <AnimatePresence>
        {activeToast && (
          <NotificationToast 
            notification={activeToast} 
            onClose={() => setActiveToast(null)} 
          />
        )}
      </AnimatePresence>
    </>
  );
};
