import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { Flame, BookOpen, Clock, TrendingUp, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const KPICard = ({ title, value, subtitle, icon: Icon, trend }: any) => (
  <motion.div whileHover={{ scale: 1.02 }} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 relative overflow-hidden group">
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-zinc-950 rounded-lg text-indigo-400 border border-zinc-800 group-hover:border-indigo-500/50 transition-colors">
        <Icon size={24} />
      </div>
      {trend && <div className="text-emerald-400 text-sm font-medium bg-emerald-400/10 px-2 py-1 rounded">{trend}</div>}
    </div>
    <h3 className="text-zinc-400 text-sm font-medium">{title}</h3>
    <div className="text-3xl font-bold text-white mt-1">{value}</div>
    {subtitle && <div className="text-zinc-500 text-xs mt-2">{subtitle}</div>}
  </motion.div>
);

export const LearnerDashboard = () => {
  const user = useAuthStore(state => state.user);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">{greeting}, {user?.name?.split(' ')[0] || 'Learner'} 👋</h1>
        <p className="text-zinc-400 mt-2">Continue building your capabilities and achieve your learning goals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Learning Streak" value="12 Days" icon={Flame} trend="+2 days" />
        <KPICard title="Courses Completed" value="08" icon={BookOpen} subtitle="Out of 12 Enrolled" />
        <KPICard title="Learning Hours" value="46.5h" icon={Clock} subtitle="This Month" />
        <KPICard title="Competency Growth" value="78 / 100" icon={TrendingUp} trend="+23%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold">Continue Learning</h2>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-indigo-500/50 transition-colors cursor-pointer group">
            <div className="p-6 flex flex-col sm:flex-row gap-6">
              <div className="w-full sm:w-48 h-32 bg-zinc-800 rounded-lg flex-shrink-0 bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600&auto=format&fit=crop")' }}></div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold group-hover:text-indigo-400 transition-colors">Advanced React Development</h3>
                  <p className="text-sm text-zinc-400 mt-1">Instructor: Sarah Drasner</p>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-zinc-300">12 / 18 Lessons Completed</span>
                    <span className="font-bold">72%</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-zinc-950 px-6 py-4 border-t border-zinc-800 flex justify-between items-center group-hover:bg-indigo-900/10 transition-colors">
              <span className="text-sm text-zinc-400">Next: Custom Hooks & Performance</span>
              <button className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium">
                <PlayCircle size={18} /> Continue Learning
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold">🧠 AI Learning Insight</h2>
          <div className="bg-gradient-to-b from-indigo-900/20 to-zinc-900 border border-indigo-500/30 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl"></div>
            <p className="text-indigo-100/90 text-sm leading-relaxed mb-6">
              Based on your recent assessments, improving your <strong>Node.js and Database Design</strong> skills will significantly increase your Backend Development competency score.
            </p>
            <div className="space-y-3 mb-6 relative z-10">
              <div className="flex items-center gap-3 text-sm font-medium text-zinc-300 bg-zinc-950/50 p-3 rounded-lg border border-zinc-800">
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs">1</div>
                Node.js Fundamentals
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-zinc-300 bg-zinc-950/50 p-3 rounded-lg border border-zinc-800">
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs">2</div>
                REST API Architecture
              </div>
            </div>
            <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-bold transition-colors shadow-lg">
              View Personalized Roadmap →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
