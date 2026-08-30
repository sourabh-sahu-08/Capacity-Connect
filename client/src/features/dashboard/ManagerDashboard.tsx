import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { AlertCircle, ArrowRight, Brain, PlayCircle, Plus, Users, BookOpen, Activity, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { getManagerOverview, getAttentionQueue } from '../../api/intelligenceApi';

export const ManagerDashboard = () => {
  const user = useAuthStore(state => state.user);
  const token = useAuthStore(state => state.token);
  const navigate = useNavigate();

  const [overview, setOverview] = useState<any>(null);
  const [queue, setQueue] = useState<any[]>([]);

  useEffect(() => {
    if (token) {
      getManagerOverview(token).then(setOverview).catch(console.error);
      getAttentionQueue(token).then(setQueue).catch(console.error);
    }
  }, [token]);

  const totalActive = overview ? overview.totalActiveLearners : 124;
  const velocity = overview ? overview.learningVelocity : '+18%';
  const avgCompletion = overview ? `${Math.round(overview.averageCompetency)}%` : '82%';

  return (
    <div className="space-y-12 pb-32 pt-10 font-sans selection:bg-indigo-500/30">
      
      {/* LEARNING PULSE (HERO) */}
      <section className="flex flex-col md:flex-row items-end justify-between gap-10 border-b border-slate-100 pb-10">
        <div className="space-y-6">
          <h2 className="text-xs font-bold tracking-[0.2em] text-slate-500 uppercase">
            Learning Command Center
          </h2>
          <div className="flex items-baseline gap-6">
            <h1 className="text-6xl md:text-8xl font-light tracking-tighter text-slate-900">
              {totalActive}
            </h1>
            <div>
              <div className="text-sm font-bold tracking-[0.2em] text-indigo-600 uppercase">
                Active Learners
              </div>
              <div className="text-xs tracking-widest text-emerald-600/80 mt-1 font-medium">
                {velocity} THIS MONTH
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button onClick={() => navigate('/learning-hub')} className="flex items-center justify-center w-12 h-12 rounded-full bg-white text-slate-900 hover:bg-slate-100 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            <Plus size={24} />
          </button>
          <div className="text-right">
            <div className="text-3xl font-light text-slate-900">{avgCompletion}</div>
            <div className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase mt-1">Avg Competency</div>
          </div>
        </div>
      </section>

      {/* DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN (ATTENTION & QUICK ACTIONS) */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* LEARNER ATTENTION QUEUE */}
          <section className="bg-white shadow-sm border border-slate-200 rounded-2xl p-6 ">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-bold tracking-[0.2em] text-slate-600 uppercase flex items-center gap-2">
                <AlertCircle size={14} className="text-rose-400" /> Needs Attention
              </h3>
              <span className="text-xs font-bold text-slate-500">{queue.length > 0 ? queue.length : 2} Actions</span>
            </div>

            <div className="space-y-4">
              {queue.length > 0 ? (
                queue.map((item, idx) => (
                  <div key={idx} onClick={() => navigate('/skill-gap')} className="group bg-white shadow-sm border border-rose-500/20 rounded-xl p-4 hover:border-rose-500/50 transition-colors cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium text-slate-900 group-hover:text-rose-300 transition-colors">{item.learner}</div>
                      <span className="text-[10px] uppercase tracking-wider text-rose-400 font-bold bg-rose-500/10 px-2 py-1 rounded">
                        Risk: {item.riskScore}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-3 flex items-center justify-between">
                      <span>{item.reason}</span>
                      <ArrowRight size={14} className="text-slate-500 group-hover:text-rose-400 transition-colors" />
                    </div>
                  </div>
                ))
              ) : (
                <div onClick={() => navigate('/skill-gap')} className="group bg-white shadow-sm border border-rose-500/20 rounded-xl p-4 hover:border-rose-500/50 transition-colors cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-slate-900 group-hover:text-rose-300 transition-colors">Rahul Sharma</div>
                    <span className="text-[10px] uppercase tracking-wider text-rose-400 font-bold bg-rose-500/10 px-2 py-1 rounded">Stalled</span>
                  </div>
                  <div className="text-sm text-slate-600">Backend Architecture</div>
                  <div className="text-xs text-slate-500 mt-3 flex items-center justify-between">
                    <span>Progress stalled for 7 days</span>
                    <ArrowRight size={14} className="text-slate-500 group-hover:text-rose-400 transition-colors" />
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* QUICK ACTIONS */}
          <section className="grid grid-cols-2 gap-4">
            <button onClick={() => navigate('/learning-hub')} className="bg-indigo-600/10 border border-indigo-500/30 hover:bg-indigo-600/20 hover:border-indigo-500/60 rounded-xl p-4 flex flex-col items-center justify-center gap-3 transition-all text-indigo-600">
              <BookOpen size={24} />
              <span className="text-xs font-bold tracking-widest uppercase">Course Library</span>
            </button>
            <button onClick={() => navigate('/skill-gap')} className="bg-white shadow-sm border border-slate-200 hover:bg-slate-100 rounded-xl p-4 flex flex-col items-center justify-center gap-3 transition-all text-slate-600">
              <Users size={24} />
              <span className="text-xs font-bold tracking-widest uppercase">Manage Learners</span>
            </button>
          </section>

        </div>

        {/* RIGHT COLUMN (COURSE & AI INSIGHTS) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* COURSE PERFORMANCE */}
          <section className="bg-white shadow-sm border border-slate-200 rounded-2xl p-6 ">
            <h3 className="text-xs font-bold tracking-[0.2em] text-slate-600 uppercase mb-6 flex items-center gap-2">
              <Activity size={14} className="text-emerald-600" /> Course Performance
            </h3>

            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
              <div className="flex-1 space-y-1">
                <h4 className="text-xl font-light text-slate-900">Advanced Node.js</h4>
                <p className="text-sm text-slate-500">124 Learners � High Engagement</p>
              </div>

              <div className="flex gap-8">
                <div>
                  <div className="text-2xl font-light text-slate-900">82%</div>
                  <div className="text-[10px] font-bold tracking-wider text-slate-500 uppercase mt-1">Completion</div>
                </div>
                <div>
                  <div className="text-2xl font-light text-slate-900">74%</div>
                  <div className="text-[10px] font-bold tracking-wider text-slate-500 uppercase mt-1">Avg Score</div>
                </div>
              </div>
            </div>

            <div onClick={() => navigate('/skill-gap')} className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center cursor-pointer group">
              <span className="text-sm font-bold tracking-widest text-indigo-600 uppercase group-hover:text-indigo-700 transition-colors">View Deep Analytics</span>
              <ArrowRight size={16} className="text-indigo-600 group-hover:translate-x-1 transition-transform" />
            </div>
          </section>

          {/* AI CONTENT INSIGHT */}
          <section className="bg-violet-50 border border-violet-200 rounded-2xl p-8 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-6 relative z-10">
              <Brain size={16} className="text-violet-600" />
              <h3 className="text-xs font-bold tracking-[0.2em] text-violet-600 uppercase">✦ Capacity AI</h3>
            </div>

            <div className="space-y-6 relative z-10">
              <div className="flex items-start gap-4">
                <div className="mt-1 p-2 bg-amber-50 rounded-lg shrink-0">
                  <AlertTriangle size={16} className="text-amber-600" />
                </div>
                <div>
                  <h4 className="text-slate-900 font-medium mb-1">High Drop-Off Detected</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    <strong className="text-slate-800">38%</strong> of learners stopped during the <strong className="text-slate-800">Database Normalization</strong> lesson. 
                    Learners are consistently struggling with the practical implementation.
                  </p>
                </div>
              </div>

              <div className="bg-white/30 border border-slate-100 rounded-xl p-5">
                <div className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-3">Recommended Action</div>
                <div className="text-sm text-slate-700">
                  Consider adding an interactive exercise before the assessment to bridge the conceptual gap.
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => navigate('/assessments')} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold tracking-wider uppercase px-6 py-3 rounded-lg transition-colors cursor-pointer relative z-20">
                  Generate Quiz
                </button>
                <button onClick={() => navigate('/skill-gap')} className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold tracking-wider uppercase px-6 py-3 rounded-lg transition-colors border border-slate-100 cursor-pointer relative z-20">
                  View Affected
                </button>
              </div>
            </div>
          </section>

        </div>
      </div>

    </div>
  );
};
