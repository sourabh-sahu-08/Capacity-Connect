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
        <div className="relative hidden w-64 sm:block"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" /><input aria-label="Search courses and competencies" placeholder="Search courses, skills..." className="w-full rounded-lg border border-slate-200 bg-black/5 py-2 pl-9 pr-3 text-xs text-slate-200 outline-none placeholder:text-slate-500 focus:border-purple-400" /></div>
      </div>

      <div className="flex items-center gap-6">
        <button aria-label="Help" className="hidden text-slate-400 transition hover:text-white sm:block"><CircleHelp size={18} /></button>
        <NotificationBell />
        <div className="relative flex items-center gap-3 border-l border-slate-200 pl-4 md:pl-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900 leading-none">{user?.name}</p>
            <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mt-1">
              {user?.role}
            </p>
          </div>
          <button onClick={() => setProfileOpen(open => !open)} aria-label="Open profile menu" className="grid h-9 w-9 place-items-center rounded-full border border-purple-200 bg-purple-100 font-bold text-purple-700">
            {user?.name?.charAt(0) || 'U'}
          </button>
          {profileOpen && <div className="absolute right-0 top-12 w-44 rounded-lg border border-white/10 bg-[#1a1925] p-1 shadow-xl"><button onClick={() => navigate('/settings')} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs text-slate-300 hover:bg-white/10"><UserRound size={14} /> My profile</button><button onClick={() => navigate('/settings')} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs text-slate-300 hover:bg-white/10"><Settings size={14} /> Settings</button><button onClick={() => navigate('/achievements')} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs text-slate-300 hover:bg-white/10"><Trophy size={14} /> Certificates</button></div>}
        </div>
      </div>
    </header>
  );
};
