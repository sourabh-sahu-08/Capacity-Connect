// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, Trash2, AlertTriangle, Clock, Filter, Search } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNotificationStore } from '../../features/notifications/notificationStore';
import type { Notification } from './notificationStore';
import { useAuthStore } from '../../store/authStore';
import axios from 'axios';
import { Link } from 'react-router-dom';

export const NotificationCenter = () => {
  const { notifications, markAsRead, markAllAsRead, removeNotification, unreadCount } = useNotificationStore();
  const { token } = useAuthStore();
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'CRITICAL'>('ALL');
  
  const filteredNotifications = notifications.filter(n => {
    if (filter === 'UNREAD') return !n.isRead;
    if (filter === 'CRITICAL') return n.priority === 'CRITICAL';
    return true;
  });

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

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    removeNotification(id);
    const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    try {
      await axios.delete(`${apiURL}/api/notifications/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    } catch (err) {}
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Notification Center
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage all your alerts and updates.</p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button 
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold tracking-widest uppercase hover:text-purple-600 hover:border-purple-200 shadow-sm"
            >
              Mark all as read
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6">
        {['ALL', 'UNREAD', 'CRITICAL'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase transition-all ${filter === f ? 'bg-purple-600 text-white shadow-md' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'}`}
          >
            {f} {f === 'UNREAD' && unreadCount > 0 && `(${unreadCount})`}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Bell className="text-slate-300" size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No notifications found</h3>
            <p className="text-sm text-slate-500">You're all caught up for now.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredNotifications.map((notif) => (
              <div 
                key={notif._id} 
                className={`p-5 flex items-start gap-4 transition-colors relative ${notif.isRead ? 'bg-white hover:bg-slate-50' : 'bg-purple-50/20 hover:bg-purple-50/40'}`}
              >
                {!notif.isRead && (
                  <span className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500"></span>
                )}
                
                <div className="shrink-0 mt-1">
                  {notif.priority === 'CRITICAL' ? (
                    <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                      <AlertTriangle size={18} />
                    </div>
                  ) : notif.priority === 'HIGH' ? (
                    <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                      <AlertTriangle size={18} />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                      <Bell size={18} />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className={`font-semibold text-base mb-1 ${notif.isRead ? 'text-slate-700' : 'text-slate-900'}`}>
                      {notif.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-slate-400 flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md">
                        <Clock size={12} />
                        {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                    {notif.message}
                  </p>
                  
                  <div className="flex items-center gap-4">
                    {notif.actionUrl && (
                      <Link 
                        to={notif.actionUrl}
                        className="text-xs font-bold tracking-widest uppercase text-purple-600 hover:text-purple-800"
                      >
                        View Details
                      </Link>
                    )}
                    
                    {!notif.isRead && (
                      <button 
                        onClick={(e) => handleMarkAsRead(e, notif._id)}
                        className="text-xs font-bold tracking-widest uppercase text-slate-500 hover:text-slate-700 flex items-center gap-1"
                      >
                        <Check size={14} /> Mark Read
                      </button>
                    )}

                    <button 
                      onClick={(e) => handleDelete(e, notif._id)}
                      className="text-xs font-bold tracking-widest uppercase text-red-400 hover:text-red-600 flex items-center gap-1 ml-auto"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
