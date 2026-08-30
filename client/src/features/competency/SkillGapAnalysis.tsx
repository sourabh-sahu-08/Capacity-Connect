import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MOCK_GAPS = [
  { skill: 'Node.js', current: 45, required: 85 },
  { skill: 'Docker', current: 20, required: 70 },
  { skill: 'AWS', current: 0, required: 60 },
  { skill: 'MongoDB', current: 40, required: 75 }
];

export const SkillGapAnalysis = () => {
  const [currentRole, setCurrentRole] = useState('Frontend Developer');
  const [targetRole, setTargetRole] = useState('Full Stack Developer');
  const [analyzed, setAnalyzed] = useState(false);

  return (
    <div className="p-8 space-y-8 text-white max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Skill Gap Analysis</h1>
        <p className="text-zinc-400 mt-2">Identify required competencies for your next role.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Current Role</label>
          <select 
            value={currentRole}
            onChange={(e) => setCurrentRole(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500"
          >
            <option>Frontend Developer</option>
            <option>Backend Developer</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Target Role</label>
          <select 
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500"
          >
            <option>Full Stack Developer</option>
            <option>Cloud Architect</option>
          </select>
        </div>
      </div>
      
      {!analyzed ? (
        <button 
          onClick={() => setAnalyzed(true)}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold transition-colors shadow-lg"
        >
          Analyze Competency Gap
        </button>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl text-center">
            <h2 className="text-xl font-bold text-amber-500 mb-2 flex items-center justify-center gap-2">
              <span className="text-2xl">⚠️</span> SKILL GAP DETECTED
            </h2>
            <div className="text-6xl font-extrabold my-6">68<span className="text-2xl text-zinc-500">%</span></div>
            <div className="text-sm font-medium text-zinc-400 uppercase tracking-widest">{targetRole} READINESS</div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold">Priority Competency Gaps</h3>
            {MOCK_GAPS.map(gap => (
              <div key={gap.skill} className="bg-zinc-900 border border-zinc-800 p-5 rounded-lg flex flex-col md:flex-row md:items-center gap-6">
                <div className="md:w-1/4 font-semibold text-lg">{gap.skill}</div>
                <div className="flex-1 space-y-3">
                  <div>
                    <div className="flex justify-between text-xs text-zinc-400 mb-1">
                      <span>Current ({gap.current}%)</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-800 rounded-full">
                      <div className="h-full bg-zinc-500 rounded-full" style={{ width: `${gap.current}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-zinc-400 mb-1">
                      <span>Required ({gap.required}%)</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-800 rounded-full">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${gap.required}%` }}></div>
                    </div>
                  </div>
                </div>
                <div className="md:w-32 text-right">
                  <div className="text-xl font-bold text-amber-400">-{gap.required - gap.current}%</div>
                  <div className="text-xs text-zinc-500 uppercase mt-1 tracking-wider">Gap</div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-indigo-900/20 border border-indigo-500/30 p-6 rounded-xl flex gap-4 items-start">
            <div className="text-3xl">🧠</div>
            <div>
              <h4 className="font-bold text-indigo-300 mb-2">AI Learning Insight</h4>
              <p className="text-indigo-100/80 leading-relaxed text-sm">
                Your biggest development opportunity lies in backend architecture and cloud infrastructure. Completing the recommended learning path could improve your Full Stack Readiness Score by approximately 32%.
              </p>
              <button className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-medium transition-colors">
                Generate Learning Path →
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
