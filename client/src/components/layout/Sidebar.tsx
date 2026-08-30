import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Layers, Zap, Hexagon, Trophy, Settings, LogOut, LayoutDashboard, Users, BookOpen, BarChart3 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const TRAINEE_NAV = [
  { name: 'Core', icon: Hexagon, path: '/dashboard' },
  { name: 'Discovery', icon: Compass, path: '/learning-hub' },
  { name: 'Passport', icon: Layers, path: '/competency-profile' },
  { name: 'Intelligence', icon: Zap, path: '/skill-gap' },
  { name: 'Milestones', icon: Trophy, path: '/achievements' },
  { name: 'System', icon: Settings, path: '/settings' },
];

const TRAINER_NAV = [
  { name: 'Pulse', icon: LayoutDashboard, path: '/manager-dashboard' },
  { name: 'Learners', icon: Users, path: '/manager-dashboard' }, // simplified for now
  { name: 'Content Studio', icon: BookOpen, path: '/manager-dashboard' },
  { name: 'Analytics', icon: BarChart3, path: '/manager-dashboard' },
  { name: 'System', icon: Settings, path: '/settings' },
];

export const Sidebar = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isTrainer = user?.role === 'MANAGER' || user?.role === 'TRAINER' || user?.role === 'ADMIN';
  const NAV_ITEMS = isTrainer ? TRAINER_NAV : TRAINEE_NAV;
  
  return (
    <div className="fixed left-0 top-0 bottom-0 w-20 flex flex-col items-center py-8 bg-white border-r border-slate-200 z-50 shadow-sm">
      <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold tracking-tighter mb-8">
        C<span className="text-indigo-200">C</span>
      </div>

      <div className="flex flex-col items-center gap-4 w-full px-3">
        {NAV_ITEMS.map((item, index) => (
          <NavLink 
            key={item.name + index} 
            to={item.path}
            onMouseEnter={() => setHoveredItem(item.name)}
            onMouseLeave={() => setHoveredItem(null)}
            className={({ isActive }) => `relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${isActive ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
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
    </div>
  );
};
