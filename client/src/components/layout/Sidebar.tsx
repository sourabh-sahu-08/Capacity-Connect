import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, BookOpen, Brain, Map, ClipboardCheck, Bot, Users, Trophy, BarChart3, Bell, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const NAV_ITEMS = [
  { name: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Learning Hub', icon: BookOpen, path: '/learning-hub' },
  { name: 'Competency Profile', icon: Brain, path: '/competency-profile' },
  { name: 'Skill Gap Analysis', icon: BarChart3, path: '/skill-gap' },
  { name: 'Learning Roadmap', icon: Map, path: '/roadmap' },
  { name: 'Assessments', icon: ClipboardCheck, path: '/assessments' },
  { name: 'Knowledge Hub', icon: Users, path: '/knowledge-hub' },
  { name: 'Achievements', icon: Trophy, path: '/achievements' },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const user = useAuthStore(state => state.user);
  
  return (
    <motion.div 
      animate={{ width: collapsed ? 80 : 280 }} 
      className="h-screen bg-zinc-950 border-r border-zinc-800 flex flex-col justify-between sticky top-0"
    >
      <div>
        <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-800">
          {!collapsed && <h1 className="text-xl font-bold tracking-tighter whitespace-nowrap">CAPACITY <span className="text-indigo-500">CONNECT</span></h1>}
          {collapsed && <h1 className="text-xl font-bold tracking-tighter text-indigo-500 mx-auto">CC</h1>}
        </div>
        <div className="p-4 space-y-1 mt-4">
          {NAV_ITEMS.map(item => (
            <NavLink 
              key={item.name} 
              to={item.path}
              className={({ isActive }) => `flex items-center gap-4 px-3 py-3 rounded-lg transition-colors ${isActive ? 'bg-indigo-600/10 text-indigo-400' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'}`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="font-medium text-sm whitespace-nowrap">{item.name}</span>}
            </NavLink>
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t border-zinc-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold shrink-0">
            {user?.name?.charAt(0) || 'U'}
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <div className="text-sm font-bold text-white truncate">{user?.name || 'User Name'}</div>
              <div className="text-xs text-zinc-500 truncate">{user?.role || 'Learner'} • {user?.organization || 'Org'}</div>
            </div>
          )}
        </div>
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex justify-center py-2 text-zinc-500 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
    </motion.div>
  );
};
