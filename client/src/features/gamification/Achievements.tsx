import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Zap, Brain, Flame, Target } from 'lucide-react';

const ACHIEVEMENTS = [
  { id: 1, title: 'Explorer', desc: 'Complete your first course', icon: Target, unlocked: true, date: 'Aug 12, 2026' },
  { id: 2, title: 'Fast Learner', desc: 'Complete 3 courses in one month', icon: Zap, unlocked: true, date: 'Aug 25, 2026' },
  { id: 3, title: 'Knowledge Master', desc: 'Achieve 5 advanced competencies', icon: Brain, unlocked: false, progress: 60 },
  { id: 4, title: 'Consistency Champion', desc: 'Maintain a 30-day learning streak', icon: Flame, unlocked: false, progress: 40 },
  { id: 5, title: 'Top Contributor', desc: 'Reach 1000 Contribution Score', icon: Star, unlocked: false, progress: 89 },
];

export const Achievements = () => {
  return (
    <div className="p-8 space-y-8 text-slate-900 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Achievements</h1>
        <p className="text-slate-600 mt-2">Track your progress and unlock rewards.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 p-6 rounded-xl text-center">
          <div className="text-sm font-medium text-slate-600 uppercase tracking-widest mb-2">Total XP</div>
          <div className="text-5xl font-extrabold text-indigo-600">2,450</div>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-xl text-center">
          <div className="text-sm font-medium text-slate-600 uppercase tracking-widest mb-2">Current Level</div>
          <div className="text-5xl font-extrabold text-emerald-600">12</div>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-xl text-center">
          <div className="text-sm font-medium text-slate-600 uppercase tracking-widest mb-2">Learning Streak</div>
          <div className="text-5xl font-extrabold text-amber-600 flex justify-center items-center gap-2"><Flame size={40} /> 12</div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold mt-8 mb-4">Badges</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ACHIEVEMENTS.map((ach, idx) => (
            <motion.div 
              key={ach.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-6 rounded-xl border ${ach.unlocked ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200/50 opacity-60'}`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${ach.unlocked ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                  <ach.icon size={24} />
                </div>
                <div>
                  <h3 className="font-bold">{ach.title}</h3>
                  {ach.unlocked && <div className="text-xs text-slate-500">{ach.date}</div>}
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-4">{ach.desc}</p>
              
              {!ach.unlocked && (
                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Progress</span>
                    <span>{ach.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-zinc-600 rounded-full" style={{ width: `${ach.progress}%` }}></div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
