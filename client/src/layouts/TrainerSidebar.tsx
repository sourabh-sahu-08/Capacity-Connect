// @ts-nocheck
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Presentation, Users, BookOpen, FileCheck, BarChart3, Lightbulb, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const NAV_ITEMS = [
  { name: 'Overview', icon: Presentation, path: '/trainer/dashboard' },
  { name: 'Learners', icon: Users, path: '/trainer/learners' },
  { name: 'Courses', icon: BookOpen, path: '/trainer/courses' },
  { name: 'Assessments', icon: FileCheck, path: '/trainer/assessments' },
  { name: 'Analytics', icon: BarChart3, path: '/trainer/analytics' },
  { name: 'Training Insights', icon: Lightbulb, path: '/trainer/insights' },
];

export const TrainerSidebar = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const logout = useAuthStore(state => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <div className="fixed left-0 top-0 bottom-0 w-20 flex flex-col items-center py-8 bg-white border-r border-slate-200 z-50 shadow-sm">
      <div className="w-10 h-10 bg-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.5)] rounded-lg flex items-center justify-center text-white font-bold tracking-tighter mb-8 cursor-pointer" onClick={() => navigate('/trainer/dashboard')}>
        C<span className="text-purple-200">C</span>
      </div>

      <div className="flex flex-col items-center gap-4 w-full px-3">
        {NAV_ITEMS.map((item, index) => (
          <NavLink 
            key={item.name + index} 
            to={item.path}
            end={item.path === '/trainer/dashboard'}
            onMouseEnter={() => setHoveredItem(item.name)}
            onMouseLeave={() => setHoveredItem(null)}
            className={({ isActive }) => `relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${isActive ? 'bg-purple-50 text-purple-600 font-medium shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
          >
            {({ isActive }) => (
              <>
                <item.icon className="w-5 h-5 shrink-0 z-10" />
                <AnimatePresence>
                  {hoveredItem === item.name && (
                    <motion.div 
                      initial={{ opacity: 0, x: 10, scale: 0.9 }}
                      animate={{ opacity: 1, x: 20, scale: 1 }}
                      exit={{ opacity: 0, x: 10, scale: 0.9 }}
                      className="absolute left-full ml-4 px-3 py-1.5 bg-white border border-slate-200 rounded-md whitespace-nowrap text-xs font-medium text-slate-900 tracking-wider shadow-lg"
                    >
                      {item.name}
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </NavLink>
        ))}
      </div>

      <div className="mt-auto w-full px-3 flex flex-col items-center gap-2">
        
        <button 
          onMouseEnter={() => setHoveredItem('Settings')}
          onMouseLeave={() => setHoveredItem(null)}
          className="relative flex items-center justify-center w-12 h-12 mx-auto rounded-xl transition-all duration-300 text-slate-500 hover:text-slate-900 hover:bg-slate-50"
        >
          <Settings className="w-5 h-5 shrink-0 z-10" />
        </button>
        <div className="w-8 h-px bg-slate-200 my-2 mx-auto" />
        <button 
          onClick={handleLogout}
          onMouseEnter={() => setHoveredItem('Logout')}
          onMouseLeave={() => setHoveredItem(null)}
          className="relative flex items-center justify-center w-12 h-12 mx-auto rounded-xl transition-all duration-300 text-slate-500 hover:text-rose-600 hover:bg-rose-50"
        >
          <LogOut className="w-5 h-5 shrink-0 z-10" />
          <AnimatePresence>
            {hoveredItem === 'Logout' && (
              <motion.div 
                initial={{ opacity: 0, x: 10, scale: 0.9 }}
                animate={{ opacity: 1, x: 20, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.9 }}
                className="absolute left-full ml-4 px-3 py-1.5 bg-white border border-slate-200 rounded-md whitespace-nowrap text-xs font-medium text-slate-900 tracking-wider shadow-lg"
              >
                Logout
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );
};
