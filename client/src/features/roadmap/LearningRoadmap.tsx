import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Lock, ArrowDown, BookOpen, Clock } from 'lucide-react';

const ROADMAP_STEPS = [
  { id: 1, title: 'JavaScript Fundamentals', status: 'Completed', type: 'course', duration: '4h' },
  { id: 2, title: 'Advanced React', status: 'InProgress', type: 'course', duration: '12h' },
  { id: 3, title: 'Node.js Architecture', status: 'Locked', type: 'course', duration: '8h' },
  { id: 4, title: 'Database Systems', status: 'Locked', type: 'course', duration: '10h' },
  { id: 5, title: 'Cloud Deployment', status: 'Locked', type: 'course', duration: '6h' },
];

export const LearningRoadmap = () => {
  return (
    <div className="p-8 space-y-8 text-slate-900 max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold">Personalized Learning Roadmap</h1>
        <p className="text-slate-600 mt-2">Your AI-generated journey to becoming a Full Stack Developer.</p>
      </div>

      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-100 -z-10"></div>
        <div className="space-y-8">
          <div className="flex gap-6 items-start">
            <div className="w-16 h-16 rounded-full bg-indigo-900/30 border-2 border-indigo-500 flex flex-col items-center justify-center shrink-0 shadow-[0_0_15px_rgba(99,102,241,0.5)] z-10 text-indigo-600 font-bold uppercase text-xs">Start</div>
            <div className="pt-4 flex-1"></div>
          </div>

          {ROADMAP_STEPS.map((step, idx) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={step.id} 
              className="flex gap-6 items-center group cursor-pointer"
            >
              <div className="w-16 flex justify-center z-10">
                {step.status === 'Completed' ? (
                  <CheckCircle2 className="text-emerald-600 w-8 h-8 bg-slate-50 rounded-full" />
                ) : step.status === 'InProgress' ? (
                  <Circle className="text-indigo-600 w-8 h-8 fill-indigo-900/50 bg-slate-50 rounded-full" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-white border border-slate-300 flex items-center justify-center">
                    <Lock size={14} className="text-slate-500" />
                  </div>
                )}
              </div>
              
              <div className={`flex-1 p-6 rounded-xl border transition-all ${
                step.status === 'Completed' ? 'bg-white shadow-sm border-slate-200 text-slate-600' :
                step.status === 'InProgress' ? 'bg-white border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.1)] transform hover:-translate-y-1' :
                'bg-white/30 border-slate-200/50 text-slate-500'
              }`}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className={`font-bold text-lg ${step.status === 'InProgress' ? 'text-slate-900' : ''}`}>{step.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded font-medium ${
                    step.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' :
                    step.status === 'InProgress' ? 'bg-indigo-100 text-indigo-600' :
                    'bg-slate-100 text-slate-500'
                  }`}>
                    {step.status === 'InProgress' ? 'In Progress 🔵' : step.status === 'Locked' ? 'Locked 🔒' : 'Completed ✅'}
                  </span>
                </div>
                <div className="flex gap-4 text-xs mt-3">
                  <span className="flex items-center gap-1"><BookOpen size={14} /> Course</span>
                  <span className="flex items-center gap-1"><Clock size={14} /> {step.duration}</span>
                </div>
              </div>
            </motion.div>
          ))}

          <div className="flex gap-6 items-center pt-4">
            <div className="w-16 flex flex-col items-center z-10">
              <ArrowDown className="text-indigo-500 mb-4 animate-bounce" />
              <div className="w-16 h-16 rounded-full bg-indigo-600 border-4 border-zinc-950 flex flex-col items-center justify-center shrink-0 shadow-[0_0_20px_rgba(99,102,241,0.8)] z-10 text-white font-bold text-2xl">🎯</div>
            </div>
            <div className="flex-1 p-6">
              <div className="text-sm text-indigo-600 font-bold uppercase tracking-widest mb-1">Target Role</div>
              <h3 className="text-2xl font-bold">Full Stack Engineer</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
