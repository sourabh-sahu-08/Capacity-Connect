// @ts-nocheck
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { Check, Trash2, AlertTriangle, Bell, Clock } from 'lucide-react';
import { useNotificationStore } from '../../features/notifications/notificationStore';
import type { Notification } from '../../features/notifications/notificationStore';
import { useAuthStore } from '../../store/authStore';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export const NotificationDropdown = ({ onClose }: { onClose: () => void }) => {
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotificationStore();
  const { token, user } = useAuthStore();
  const navigate = useNavigate();

  const handleMarkAsRead = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    markAsRead(id);
    const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    try {
      await axios.patch(`${apiURL}/api/notifications/${id}/read`, {}, { headers: { Authorization: `Bearer ${token}` } });
    } catch (err) {}
  };

  const handleMarkAllAsRead = async () => {
    markAllAsRead();
    const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    try {
      await axios.patch(`${apiURL}/api/notifications/read-all`, {}, { headers: { Authorization: `Bearer ${token}` } });
    } catch (err) {}
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      handleMarkAsRead({ stopPropagation: () => {} } as any, notification._id);
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
    onClose();
  };

  const rolePath = user?.role === 'TRAINER' ? '/trainer/notifications' : user?.role === 'MANAGER' ? '/manager/notifications' : '/notifications';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
      className="absolute top-12 right-0 w-80 sm:w-96 bg-white border border-slate-200 shadow-xl rounded-xl overflow-hidden z-50 flex flex-col max-h-[500px]"
    >
      <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          Notifications
          {unreadCount > 0 && (
            <span className="bg-purple-100 text-purple-700 text-[10px] px-2 py-0.5 rounded-full">{unreadCount} new</span>
          )}
        </h3>
        {unreadCount > 0 && (
          <button 
            onClick={handleMarkAllAsRead}
            className="text-[10px] font-bold tracking-widest uppercase text-slate-500 hover:text-purple-600"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="overflow-y-auto flex-1">
        {notifications.length === 0 ? (
          <div className="p-8 text-center flex flex-col items-center">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
              <Bell className="text-slate-400" size={24} />
            </div>
            <p className="text-sm font-medium text-slate-900">All caught up!</p>
            <p className="text-xs text-slate-500 mt-1">You have no new notifications.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.slice(0, 8).map(notif => (
              <div 
                key={notif._id} 
                onClick={() => handleNotificationClick(notif)}
                className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors relative flex gap-3 ${notif.isRead ? 'opacity-70' : 'bg-purple-50/30'}`}
              >
                {!notif.isRead && (
                  <span className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500 rounded-r-full"></span>
                )}
                
                <div className="shrink-0 pt-1">
                  {notif.priority === 'CRITICAL' ? (
                    <AlertTriangle className="text-red-500" size={16} />
                  ) : notif.priority === 'HIGH' ? (
                    <AlertTriangle className="text-amber-500" size={16} />
                  ) : (
                    <Bell className="text-purple-500" size={16} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`text-sm font-semibold truncate pr-4 ${notif.isRead ? 'text-slate-700' : 'text-slate-900'}`}>
                      {notif.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-2">
                    {notif.message}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                      <Clock size={10} />
                      {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                    </span>
                    {!notif.isRead && (
                      <button 
                        onClick={(e) => handleMarkAsRead(e, notif._id)}
                        className="text-[10px] font-bold uppercase text-purple-600 hover:text-purple-800"
                      >
                        Mark Read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-3 border-t border-slate-100 bg-slate-50 text-center">
        <Link 
          to={rolePath} 
          onClick={onClose}
          className="text-xs font-bold tracking-widest uppercase text-slate-600 hover:text-purple-600"
        >
          View All Notifications
        </Link>
      </div>
    </motion.div>
  );
};
