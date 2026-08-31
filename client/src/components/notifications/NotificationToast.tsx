// @ts-nocheck
import React from 'react';
import { motion } from 'framer-motion';
import { Bell, X, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import type { Notification } from '../../features/notifications/notificationStore';
import { Link } from 'react-router-dom';

export const NotificationToast = ({ 
  notification, 
  onClose 
}: { 
  notification: Notification; 
  onClose: () => void 
}) => {

  const getIcon = () => {
    switch(notification.priority) {
      case 'CRITICAL': return <AlertTriangle className="text-red-500" size={20} />;
      case 'HIGH': return <AlertTriangle className="text-amber-500" size={20} />;
      case 'MEDIUM': return <CheckCircle className="text-emerald-500" size={20} />;
      default: return <Info className="text-blue-500" size={20} />;
    }
  };

  const getBorderColor = () => {
    switch(notification.priority) {
      case 'CRITICAL': return 'border-red-500';
      case 'HIGH': return 'border-amber-500';
      case 'MEDIUM': return 'border-emerald-500';
      default: return 'border-blue-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={`fixed bottom-8 right-8 z-[100] bg-white border-l-4 ${getBorderColor()} shadow-2xl rounded-r-xl p-4 w-80 sm:w-96 flex flex-col gap-2`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          {getIcon()}
          <h4 className="font-bold text-slate-900 text-sm">{notification.title}</h4>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <X size={16} />
        </button>
      </div>
      
      <p className="text-sm text-slate-600 pl-8 line-clamp-2">
        {notification.message}
      </p>

      {notification.actionUrl && (
        <div className="pl-8 mt-2">
          <Link 
            to={notification.actionUrl}
            onClick={onClose}
            className="text-xs font-bold tracking-widest uppercase text-purple-600 hover:text-purple-700"
          >
            View Details
          </Link>
        </div>
      )}
    </motion.div>
  );
};
