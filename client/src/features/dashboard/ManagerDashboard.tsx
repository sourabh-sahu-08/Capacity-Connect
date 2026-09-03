// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, AlertTriangle, ShieldAlert, Target, Activity, 
  Brain, TrendingUp, TrendingDown, ChevronRight, BarChart3,
  Building2, Calendar, Filter, Bell, Flag, ArrowRight, BookOpen
} from 'lucide-react';
// import { getManagerOverview, getAttentionQueue } from '../../api/intelligenceApi';

// --- MOCK DATA LAYER ---
const executiveData = {
  health: {
    activeLearners: 248,
    avgCompetency: 76,
    readiness: 72,
    completion: 81,
    teamsAtRisk: 3,
    criticalGaps: 5
  },
  strategicAttention: [
    { id: 1, target: 'Engineering Team', issue: 'Cloud Infrastructure readiness is below target.', readiness: 48, risk: 'HIGH', actionLabel: 'View Team' },
    { id: 2, target: 'Backend Development', issue: '34% of employees have a critical skill gap in System Design.', readiness: null, risk: 'HIGH', actionLabel: 'View Gap Analysis' },
    { id: 3, target: 'Product Team', issue: 'Learning engagement dropped 18% this month.', readiness: null, risk: 'MEDIUM', actionLabel: 'Investigate' }
  ],
  teams: [
    { id: 1, name: 'Engineering', members: 124, competency: 78, readiness: 72, trend: 'Improving', trendDir: 'up', status: 'Healthy' },
    { id: 2, name: 'Product', members: 42, competency: 64, readiness: 58, trend: 'Declining', trendDir: 'down', status: 'Needs Attention' },
    { id: 3, name: 'Design', members: 32, competency: 81, readiness: 84, trend: 'Stable', trendDir: 'up', status: 'Healthy' },
    { id: 4, name: 'Data Science', members: 50, competency: 69, readiness: 65, trend: 'Improving', trendDir: 'up', status: 'Healthy' }
  ],
  criticalGaps: [
    { id: 1, skill: 'Cloud Infrastructure', affected: 46, importance: 'Critical', severity: 'HIGH' },
    { id: 2, skill: 'System Design', affected: 38, importance: 'High', severity: 'HIGH' },
    { id: 3, skill: 'Data Analytics', affected: 29, importance: 'Medium', severity: 'MEDIUM' }
  ],
  roleReadiness: [
    { id: 1, role: 'Full Stack Developer', readiness: 78, target: 80 },
    { id: 2, role: 'Cloud Engineer', readiness: 54, target: 85 },
    { id: 3, role: 'Data Analyst', readiness: 69, target: 75 }
  ],
  aiInsight: {
    title: 'Cloud Infrastructure is currently the largest capability risk across Engineering.',
    description: '46 employees are below the required competency threshold.',
    impact: 'Project readiness may decrease by 14%.',
    recommendation: 'Launch targeted Cloud Upskilling Program.'
  },
  recentActivity: [
    { id: 1, text: 'Product Team started Q3 Agile Training', time: '2 hours ago' },
    { id: 2, text: '14 Engineers completed React Certification', time: '1 day ago' },
    { id: 3, text: 'New skill gap identified in Cloud Security', time: '2 days ago' }
  ]
};

export const ManagerDashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeSecondaryTab, setActiveSecondaryTab] = useState('Activity');
  const [timeframe, setTimeframe] = useState('30D');

  useEffect(() => {
    // Simulate API fetch for the executive dashboard data
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-32 pb-32 pt-10 font-sans selection:bg-purple-500/30">
      
      {/* HERO / WORKFORCE CORE */}
      <section className="relative flex flex-col items-center justify-center min-h-[60vh]">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
           <div className="w-[800px] h-[800px] border border-slate-100 rounded-full" />
           <div className="w-[600px] h-[600px] border border-slate-100 rounded-full absolute" />
           <div className="w-[400px] h-[400px] border border-slate-100 rounded-full absolute" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 mb-20 z-10 text-center"
        >
          <h2 className="text-xs font-medium tracking-[0.2em] text-slate-500 uppercase">
            Workforce Intelligence
          </h2>
          <h1 className="text-sm font-medium tracking-[0.3em] text-slate-700 uppercase">
            Organization capability & readiness
          </h1>
        </motion.div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="text-[10rem] md:text-[12rem] font-light leading-none tracking-tighter bg-clip-text text-transparent bg-linear-to-b from-slate-900 to-slate-500">
            {executiveData.kpis.overallCompetency}
          </div>
          <div className="text-sm font-bold tracking-[0.2em] text-purple-600 mt-4 uppercase">
            Competency Index
          </div>
          <div className="text-xs tracking-widest text-emerald-600/80 mt-2 font-medium uppercase">
            {executiveData.kpis.competencyGrowth} THIS MONTH
          </div>
        </div>

        {/* Constellation Nodes for Manager */}
        <div className="absolute inset-0 pointer-events-none">
          {[
            { id: '1', x: '50%', y: '10%', label: 'Engineering (78%)' },
            { id: '2', x: '80%', y: '50%', label: 'Product (64%)' },
            { id: '3', x: '50%', y: '90%', label: 'Design (81%)' },
            { id: '4', x: '20%', y: '50%', label: 'Marketing (70%)' },
          ].map(node => (
            <div 
              key={node.id} 
              className="absolute pointer-events-auto flex flex-col items-center gap-2 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-500 hover:scale-110 cursor-crosshair"
              style={{ left: node.x, top: node.y }}
            >
              <div className="w-3 h-3 rounded-full bg-slate-300 hover:bg-purple-400 hover:shadow-[0_0_20px_rgba(99,102,241,0.6)] transition-all" />
              <div className="text-[10px] tracking-[0.2em] uppercase font-bold text-slate-500 hover:text-purple-700 transition-colors">
                {node.label}
              </div>
            </div>
          ))}
          <svg className="absolute inset-0 w-full h-full opacity-20" style={{ zIndex: -1 }}>
            <line x1="20%" y1="50%" x2="50%" y2="50%" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="80%" y1="50%" x2="50%" y2="50%" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="50%" y1="10%" x2="50%" y2="50%" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="50%" y1="90%" x2="50%" y2="50%" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
          </svg>
        </div>
      </section>

      {/* PRIORITY ACTION */}
      <section className="mt-20">
        <div className="bg-linear-to-br from-violet-50 to-purple-50 border border-violet-200 rounded-xl p-10 flex flex-col md:flex-row items-end justify-between gap-10">
          <div className="space-y-8 flex-1">
            <h3 className="text-xs font-bold tracking-[0.2em] text-violet-600 uppercase flex items-center gap-2">
              <Brain size={14} className="text-violet-600" /> Strategic Insight
            </h3>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-slate-900 leading-tight">
              {executiveData.aiInsight.headline}
            </h2>
            <p className="text-slate-600 max-w-md text-lg leading-relaxed">
              {executiveData.aiInsight.impact} {executiveData.aiInsight.recommendation}
            </p>
          </div>
          <div className="shrink-0 flex flex-col items-end gap-6">
            <div className="text-sm font-medium tracking-widest text-slate-500 uppercase">
              Action Required
            </div>
            <button className="group flex items-center gap-4 bg-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.5)] hover:bg-purple-700 text-white px-8 py-4 rounded-full transition-all shadow-sm">
              <span className="text-sm font-bold tracking-widest uppercase">Deploy Training</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* HORIZONTAL TIMELINE / WORKFLOW */}
      <section className="border-t border-slate-100 pt-20">
        <h3 className="text-xs font-bold tracking-[0.2em] text-slate-500 uppercase mb-16">
          Capability Trajectory
        </h3>
        
        <div className="relative">
          <div className="absolute top-4 left-0 right-0 h-px bg-slate-200"></div>
          
          <div className="grid grid-cols-3 gap-8 relative z-10">
            {/* PAST */}
            <div className="space-y-6">
              <div className="w-8 h-8 rounded-full bg-white border border-slate-300 flex items-center justify-center mx-auto md:mx-0">
                <div className="w-2 h-2 rounded-full bg-zinc-600"></div>
              </div>
              <div>
                <div className="text-xs font-medium tracking-[0.2em] text-slate-500 uppercase mb-2">Q3 Objective</div>
                <h4 className="text-lg font-medium text-slate-600">Cloud Architecture</h4>
                <div className="text-xs tracking-widest text-emerald-600/70 mt-2 uppercase">Achieved Target</div>
              </div>
            </div>

            {/* NOW */}
            <div className="space-y-6">
              <div className="w-8 h-8 rounded-full bg-purple-50 border border-purple-500/50 flex items-center justify-center mx-auto md:mx-0 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
              </div>
              <div>
                <div className="text-xs font-medium tracking-[0.2em] text-purple-600 uppercase mb-2">Current Focus</div>
                <h4 className="text-lg font-medium text-slate-900">Machine Learning</h4>
                <div className="text-xs tracking-widest text-slate-600 mt-2 uppercase">Accelerating</div>
              </div>
            </div>

            {/* FUTURE */}
            <div className="space-y-6">
              <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center mx-auto md:mx-0">
                <div className="w-2 h-2 rounded-full border border-slate-300"></div>
              </div>
              <div>
                <div className="text-xs font-medium tracking-[0.2em] text-slate-500 uppercase mb-2">Q1 Roadmap</div>
                <h4 className="text-lg font-medium text-slate-500">Generative AI</h4>
                <div className="text-xs tracking-widest text-slate-500 mt-2 uppercase">Planning Phase</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INSIGHTS AS STORIES */}
      <section className="border-t border-slate-100 pt-20">
        <h3 className="text-xs font-bold tracking-[0.2em] text-slate-500 uppercase mb-12">
          Readiness Story
        </h3>
        
        <div className="group cursor-pointer">
          <div className="text-[6rem] md:text-[8rem] font-light leading-none tracking-tighter text-slate-900 mb-8 group-hover:text-purple-100 transition-colors">
            {executiveData.kpis.rolesFilled}%
          </div>
          <div className="max-w-2xl space-y-6">
            <h4 className="text-xl md:text-2xl font-light text-slate-700 leading-relaxed">
              Target roles ready for deployment. The largest capability gap is currently situated in <strong className="text-slate-900 font-medium">Product Management</strong>.
            </h4>
            <div className="flex items-center gap-2 text-sm font-bold tracking-widest text-purple-600 uppercase group-hover:text-purple-700 transition-colors">
              Explore Gap Analysis <ChevronRight size={16} />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
