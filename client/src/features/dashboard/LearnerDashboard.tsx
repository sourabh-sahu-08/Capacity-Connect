import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { ArrowRight, ChevronRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { getCompetencyProfile, getSkillGaps } from '../../api/intelligenceApi';

export const LearnerDashboard = () => {
  const user = useAuthStore(state => state.user);
  const token = useAuthStore(state => state.token);
  const navigate = useNavigate();
  const firstName = user?.name?.split(' ')[0] || 'SOURABH';
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const [profile, setProfile] = useState<any>(null);
  const [gaps, setGaps] = useState<any>(null);

  useEffect(() => {
    if (token) {
      getCompetencyProfile(token).then(setProfile).catch(console.error);
      getSkillGaps(token, 'dummy_role_id').then(setGaps).catch(console.error);
    }
  }, [token]);

  const capabilityNodes = [
    { id: '1', x: '50%', y: '10%', label: 'Architecture' },
    { id: '2', x: '80%', y: '50%', label: 'Systems' },
    { id: '3', x: '50%', y: '90%', label: 'Logic' },
    { id: '4', x: '20%', y: '50%', label: 'UI/UX' },
  ];

  const overallScore = profile ? Math.round(profile.overallScore) : 78;
  const growth = profile?.growth?.monthly ? `+${Math.round(profile.growth.monthly)}%` : '+6.4%';
  const actionTitle = gaps?.nextBestAction?.title || 'Strengthen Backend Architecture.';
  const actionImpact = gaps?.nextBestAction?.estimatedImpact || 14;

  return (
    <div className="space-y-32 pb-32 pt-10 font-sans selection:bg-indigo-500/30">
      
      {/* HERO / CAPABILITY CORE */}
      <section className="relative flex flex-col items-center justify-center min-h-[60vh]">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
           <div className="w-[800px] h-[800px] border border-white/5 rounded-full" />
           <div className="w-[600px] h-[600px] border border-white/5 rounded-full absolute" />
           <div className="w-[400px] h-[400px] border border-white/5 rounded-full absolute" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 mb-20 z-10"
        >
          <h2 className="text-xs font-medium tracking-[0.2em] text-zinc-500 uppercase">
            Good Evening, {firstName}
          </h2>
          <h1 className="text-sm font-medium tracking-[0.3em] text-zinc-300 uppercase">
            Your capability system is evolving
          </h1>
        </motion.div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="text-[10rem] md:text-[12rem] font-light leading-none tracking-tighter bg-clip-text text-transparent bg-linear-to-b from-white to-zinc-600">
            {overallScore}
          </div>
          <div className="text-sm font-bold tracking-[0.2em] text-indigo-400 mt-4 uppercase">
            Capability Core
          </div>
          <div className="text-xs tracking-widest text-emerald-400/80 mt-2 font-medium">
            {growth} THIS MONTH
          </div>
        </div>

        {/* Constellation Nodes */}
        <div className="absolute inset-0 pointer-events-none">
          {capabilityNodes.map(node => (
            <div 
              key={node.id} 
              className="absolute pointer-events-auto flex flex-col items-center gap-2 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-500 hover:scale-110 cursor-crosshair"
              style={{ left: node.x, top: node.y }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <div className={`w-3 h-3 rounded-full ${hoveredNode === node.id ? 'bg-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.6)]' : 'bg-white/20'}`} />
              <div className={`text-[10px] tracking-[0.2em] uppercase font-bold transition-colors ${hoveredNode === node.id ? 'text-indigo-300' : 'text-zinc-600'}`}>
                {node.label}
              </div>
            </div>
          ))}
          {/* Subtle connecting lines */}
          <svg className="absolute inset-0 w-full h-full opacity-20" style={{ zIndex: -1 }}>
            <line x1="20%" y1="50%" x2="50%" y2="50%" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="80%" y1="50%" x2="50%" y2="50%" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="50%" y1="10%" x2="50%" y2="50%" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="50%" y1="90%" x2="50%" y2="50%" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
          </svg>
        </div>
      </section>

      {/* NEXT BEST ACTION */}
      <section className="border-t border-white/5 pt-20">
        <div className="flex flex-col md:flex-row items-end justify-between gap-10">
          <div className="space-y-8 flex-1">
            <h3 className="text-xs font-bold tracking-[0.2em] text-zinc-500 uppercase flex items-center gap-2">
              <Sparkles size={14} className="text-indigo-400" /> Next Best Action
            </h3>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-white leading-tight">
              {actionTitle}
            </h2>
            <p className="text-zinc-400 max-w-md text-lg leading-relaxed">
              Improving this competency could increase your target role readiness by <strong className="text-white font-medium">{actionImpact}%</strong>.
            </p>
          </div>
          <div className="shrink-0 flex flex-col items-end gap-6">
            <div className="text-sm font-medium tracking-widest text-zinc-500 uppercase">
              Est. Effort · 4.5 Hours
            </div>
            <button onClick={() => navigate('/learning-hub')} className="group flex items-center gap-4 bg-white hover:bg-zinc-200 text-black px-8 py-4 rounded-full transition-all">
              <span className="text-sm font-bold tracking-widest uppercase">Start Path</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* HORIZONTAL TIMELINE */}
      <section className="border-t border-white/5 pt-20">
        <h3 className="text-xs font-bold tracking-[0.2em] text-zinc-500 uppercase mb-16">
          Career Evolution
        </h3>
        
        <div className="relative">
          <div className="absolute top-4 left-0 right-0 h-px bg-white/10"></div>
          
          <div className="grid grid-cols-3 gap-8 relative z-10">
            {/* PAST */}
            <div className="space-y-6">
              <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/20 flex items-center justify-center mx-auto md:mx-0">
                <div className="w-2 h-2 rounded-full bg-zinc-600"></div>
              </div>
              <div>
                <div className="text-xs font-medium tracking-[0.2em] text-zinc-600 uppercase mb-2">Past</div>
                <h4 className="text-lg font-medium text-zinc-400">JavaScript Foundation</h4>
                <div className="text-xs tracking-widest text-emerald-500/70 mt-2 uppercase">Completed</div>
              </div>
            </div>

            {/* NOW */}
            <div className="space-y-6">
              <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/50 flex items-center justify-center mx-auto md:mx-0 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>
              </div>
              <div>
                <div className="text-xs font-medium tracking-[0.2em] text-indigo-400 uppercase mb-2">Now</div>
                <h4 className="text-lg font-medium text-white">Backend Architecture</h4>
                <div className="text-xs tracking-widest text-zinc-400 mt-2 uppercase">In Progress</div>
              </div>
            </div>

            {/* FUTURE */}
            <div className="space-y-6">
              <div className="w-8 h-8 rounded-full bg-black border border-white/10 flex items-center justify-center mx-auto md:mx-0">
                <div className="w-2 h-2 rounded-full border border-zinc-700"></div>
              </div>
              <div>
                <div className="text-xs font-medium tracking-[0.2em] text-zinc-600 uppercase mb-2">Future</div>
                <h4 className="text-lg font-medium text-zinc-500">Full Stack Engineer</h4>
                <div className="text-xs tracking-widest text-zinc-600 mt-2 uppercase">Target</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INSIGHTS AS STORIES */}
      <section className="border-t border-white/5 pt-20">
        <h3 className="text-xs font-bold tracking-[0.2em] text-zinc-500 uppercase mb-12">
          Growth Story
        </h3>
        
        <div className="group cursor-pointer">
          <div className="text-[6rem] md:text-[8rem] font-light leading-none tracking-tighter text-white mb-8 group-hover:text-indigo-100 transition-colors">
            +16%
          </div>
          <div className="max-w-2xl space-y-6">
            <h4 className="text-xl md:text-2xl font-light text-zinc-300 leading-relaxed">
              Competency growth over the last 90 days. Your strongest acceleration happened after completing <strong className="text-white font-medium">Advanced React Architecture</strong>.
            </h4>
            <div onClick={() => navigate('/competency-profile')} className="flex items-center gap-2 text-sm font-bold tracking-widest text-indigo-400 uppercase group-hover:text-indigo-300 transition-colors">
              Explore Growth <ChevronRight size={16} />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
