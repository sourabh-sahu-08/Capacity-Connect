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
    <div className="fixed left-6 top-0 bottom-0 flex flex-col justify-center z-50 pointer-events-none">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-full p-3 flex flex-col gap-6 pointer-events-auto shadow-2xl"
      >
        {NAV_ITEMS.map((item, index) => (
          <NavLink 
            key={item.name + index} 
            to={item.path}
            onMouseEnter={() => setHoveredItem(item.name)}
            onMouseLeave={() => setHoveredItem(null)}
            className={({ isActive }) => `relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${isActive ? 'bg-indigo-500/20 text-indigo-400' : 'text-zinc-500 hover:text-zinc-200'}`}
          >
            {({ isActive }) => (
              <>
                <item.icon className="w-5 h-5 shrink-0 z-10" />
                {isActive && (
                  <motion.div layoutId="activeNav" className="absolute inset-0 bg-indigo-500/10 border border-indigo-500/30 rounded-full" />
                )}
                <AnimatePresence>
                  {hoveredItem === item.name && (
                    <motion.div 
                      initial={{ opacity: 0, x: 10, scale: 0.9 }}
                      animate={{ opacity: 1, x: 20, scale: 1 }}
                      exit={{ opacity: 0, x: 10, scale: 0.9 }}
                      className="absolute left-full ml-4 px-3 py-1.5 bg-zinc-900 border border-white/10 rounded-md whitespace-nowrap text-xs font-medium text-white tracking-wider shadow-lg"
                    >
                      {item.name}
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </NavLink>
        ))}

        <div className="w-10 h-px bg-white/10 my-1 rounded-full mx-auto" />

        <button 
          onClick={handleLogout}
          onMouseEnter={() => setHoveredItem('Logout')}
          onMouseLeave={() => setHoveredItem(null)}
          className="relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10"
        >
          <LogOut className="w-5 h-5 shrink-0 z-10" />
          <AnimatePresence>
            {hoveredItem === 'Logout' && (
              <motion.div 
                initial={{ opacity: 0, x: 10, scale: 0.9 }}
                animate={{ opacity: 1, x: 20, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.9 }}
                className="absolute left-full ml-4 px-3 py-1.5 bg-zinc-900 border border-white/10 rounded-md whitespace-nowrap text-xs font-medium text-white tracking-wider shadow-lg"
              >
                Logout
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </motion.div>
    </div>
  );
};
