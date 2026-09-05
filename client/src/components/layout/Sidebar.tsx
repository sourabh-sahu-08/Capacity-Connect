// @ts-nocheck
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, BookOpen, Brain, Compass, FileCheck, Hexagon, Layers, LogOut, Settings, Trophy, UserRound } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const TRAINEE_NAV = [
  { name: 'Dashboard', icon: Hexagon, path: '/dashboard' },
  { name: 'Explore courses', icon: Compass, path: '/learning-hub' },
  { name: 'My learning', icon: BookOpen, path: '/learning-hub' },
  { name: 'Assessments', icon: FileCheck, path: '/learning-hub' },
  { name: 'Progress', icon: BarChart3, path: '/competency-profile' },
  { name: 'Competencies', icon: Brain, path: '/competency-profile' },
  { name: 'Certificates', icon: Trophy, path: '/achievements' },
  { name: 'System', icon: Settings, path: '/settings' },
];

export const Sidebar = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const logout = useAuthStore(state => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <div className="fixed left-0 top-0 bottom-0 z-50 hidden w-20 flex-col items-center bg-white py-8 shadow-sm md:flex">
      <div className="w-10 h-10 bg-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.5)] rounded-lg flex items-center justify-center text-white font-bold tracking-tighter mb-8 cursor-pointer" onClick={() => navigate('/dashboard')}>
        C<span className="text-purple-200">C</span>
      </div>

      <div className="flex flex-col items-center gap-4 w-full px-3">
        {TRAINEE_NAV.map((item, index) => (
          <NavLink 
            key={item.name + index} 
            to={item.path}
            onMouseEnter={() => setHoveredItem(item.name)}
            onMouseLeave={() => setHoveredItem(null)}
            className={({ isActive }) => `relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${isActive ? 'bg-purple-50 text-purple-600 font-medium' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
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

      <div className="mt-auto w-full px-3">
        <div className="w-8 h-px bg-slate-200 my-4 mx-auto" />
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
      <div className="fixed bottom-0 left-0 right-0 flex h-16 items-center justify-around border-t border-slate-200 bg-white px-2 md:hidden">
        {TRAINEE_NAV.slice(0, 5).map(item => <NavLink key={`mobile-${item.name}`} to={item.path} className={({ isActive }) => `grid h-11 w-14 place-items-center rounded-lg ${isActive ? 'text-purple-600' : 'text-slate-500'}`} aria-label={item.name}><item.icon size={19} /></NavLink>)}
        <button onClick={handleLogout} className="grid h-11 w-14 place-items-center rounded-lg text-slate-500" aria-label="Log out"><LogOut size={19} /></button>
      </div>
    </div>
  );
};
