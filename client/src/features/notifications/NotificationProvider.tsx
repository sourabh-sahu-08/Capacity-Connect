import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNotificationStore } from '../../features/notifications/notificationStore';
import type { Notification } from './notificationStore';
import { useAuthStore } from '../../store/authStore';
import { NotificationToast } from '../../components/notifications/NotificationToast';
import { AnimatePresence } from 'framer-motion';
import { useSocket } from '../../hooks/useSocket';

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const token = useAuthStore(state => state.token);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  
  const socket = useSocket(token);
  
  const [activeToast, setActiveToast] = useState<Notification | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    setNotifications,
    addNotification,
    setUnreadCount,
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
    } else {
      reset();
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    if (!socket) return;

    const onConnect = () => {
      setSocketConnected(true);
      fetchInitialData();
    };

    const onDisconnect = () => {
      setSocketConnected(false);
    };

    const onNewNotification = (notification: Notification) => {
      addNotification(notification);
      
      setActiveToast(notification);
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = setTimeout(() => {
        setActiveToast(null);
      }, 5000);
    };

    const onCountUpdated = (data: { unreadCount: number }) => {
      setUnreadCount(data.unreadCount);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('notification:new', onNewNotification);
    socket.on('notification:count_updated', onCountUpdated);

    if (socket.connected) {
      setSocketConnected(true);
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('notification:new', onNewNotification);
      socket.off('notification:count_updated', onCountUpdated);
    };
  }, [socket]);

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
