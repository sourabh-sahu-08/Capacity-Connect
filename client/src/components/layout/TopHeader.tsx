// @ts-nocheck
import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { NotificationBell } from '../notifications/NotificationBell';
import { CircleHelp, Search, Settings, Trophy, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TopHeader = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md md:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative hidden w-64 sm:block"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input aria-label="Search courses and competencies" placeholder="Search courses, skills..." className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:border-purple-500 focus:bg-white transition-colors" /></div>
      </div>

      <div className="flex items-center gap-6">
        <button aria-label="Help" className="hidden text-slate-400 transition hover:text-slate-600 sm:block"><CircleHelp size={18} /></button>
        <NotificationBell />
        <div className="relative flex items-center gap-3 border-l border-slate-200 pl-4 md:pl-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900 leading-none">{user?.name}</p>
            <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mt-1">
              {user?.role}
            </p>
          </div>
          <button onClick={() => setProfileOpen(open => !open)} aria-label="Open profile menu" className="grid h-9 w-9 place-items-center rounded-full border border-purple-200 bg-purple-100 font-bold text-purple-700 transition hover:bg-purple-200">
            {user?.name?.charAt(0) || 'U'}
          </button>
          {profileOpen && (
            <div className="absolute right-0 top-12 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <button 
                onClick={() => { setProfileOpen(false); navigate('/profile'); }} 
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
              >
                <UserRound size={15} className="text-purple-600" /> Edit Profile & Bio
              </button>
              {user?.id && (
                <button 
                  onClick={() => { setProfileOpen(false); navigate(`/profile/${user.id}`); }} 
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                >
                  <UserRound size={15} className="text-indigo-600" /> View Public Profile
                </button>
              )}
              <button 
                onClick={() => { setProfileOpen(false); navigate('/network'); }} 
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
              >
                <Users size={15} className="text-emerald-600" /> Discover Network
              </button>
              <button 
                onClick={() => { setProfileOpen(false); navigate('/profile?tab=security'); }} 
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
              >
                <Settings size={15} className="text-slate-500" /> Settings & Security
              </button>
              <button 
                onClick={() => { setProfileOpen(false); navigate('/achievements'); }} 
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
              >
                <Trophy size={15} className="text-amber-500" /> Certificates & Badges
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
