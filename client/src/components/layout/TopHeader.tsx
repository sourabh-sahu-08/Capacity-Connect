// @ts-nocheck
import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { NotificationBell } from '../notifications/NotificationBell';

export const TopHeader = () => {
  const { user } = useAuthStore();

  return (
    <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between w-full">
      <div className="flex items-center gap-4">
        {/* Breadcrumb or Context could go here */}
      </div>

      <div className="flex items-center gap-6">
        <NotificationBell />
        
        <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900 leading-none">{user?.name}</p>
            <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mt-1">
              {user?.role}
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold border border-purple-200">
            {user?.name?.charAt(0) || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};
