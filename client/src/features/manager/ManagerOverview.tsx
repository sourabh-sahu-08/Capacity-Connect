import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, AlertTriangle, ShieldAlert, Target, Activity, 
  Brain, TrendingUp, TrendingDown, ChevronRight, BarChart3,
  Building2, Calendar, Filter, Bell, Flag, ArrowRight, BookOpen
} from 'lucide-react';

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
  aiInsight: {
    title: 'Cloud Infrastructure is currently the largest capability risk across Engineering.',
    description: '46 employees are below the required competency threshold.',
    impact: 'Project readiness may decrease by 14%.',
    recommendation: 'Launch targeted Cloud Upskilling Program.'
  }
};

export const ManagerOverview = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    <div className="space-y-10 pb-32">
      
      {/* 1. EXECUTIVE HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">Workforce Intelligence</h1>
          <p className="text-sm text-slate-500">A real-time overview of your organization\'s capability and readiness.</p>
        </div>
      </header>

      {/* 2. ORGANIZATION HEALTH OVERVIEW */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Active Workforce', value: executiveData.health.activeLearners },
          { label: 'Avg Competency', value: `${executiveData.health.avgCompetency}%` },
          { label: 'Workforce Readiness', value: `${executiveData.health.readiness}%` },
          { label: 'Completion Rate', value: `${executiveData.health.completion}%` },
          { label: 'Teams At Risk', value: executiveData.health.teamsAtRisk, alert: true },
          { label: 'Critical Gaps', value: executiveData.health.criticalGaps, alert: true }
        ].map((kpi, idx) => (
          <div key={idx} className={`bg-white border ${kpi.alert ? 'border-amber-200' : 'border-slate-200'} rounded-lg p-3 flex flex-col justify-center shadow-sm`}>
            <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-1">{kpi.label}</span>
            <span className={`text-xl font-medium ${kpi.alert ? 'text-amber-600' : 'text-slate-900'}`}>{kpi.value}</span>
          </div>
        ))}
      </section>

      {/* 3. STRATEGIC ATTENTION */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold tracking-widest text-slate-900 uppercase flex items-center gap-2">
            <ShieldAlert size={16} className="text-rose-500" /> Strategic Attention
          </h2>
          <Link to="/manager/skill-gaps" className="text-[10px] font-bold tracking-widest text-purple-600 uppercase hover:text-purple-700">View All Risks ?</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {executiveData.strategicAttention.map(item => (
            <div key={item.id} className="bg-white border border-rose-200 rounded-xl p-5 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
              <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
              <div className="flex justify-between items-start mb-2 pl-2">
                <span className="text-[10px] font-bold tracking-widest text-rose-600 uppercase">{item.target}</span>
                <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded ${item.risk === 'HIGH' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                  {item.risk} RISK
                </span>
              </div>
              <p className="text-sm font-medium text-slate-900 mb-4 pl-2 leading-relaxed">{item.issue}</p>
              <div className="pl-2 mt-auto">
                <button className="text-[10px] font-bold tracking-widest uppercase text-slate-500 group-hover:text-rose-600 transition-colors flex items-center gap-1">
                  {item.actionLabel} <ArrowRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
        {/* 4. CAPABILITY SNAPSHOT */}
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold tracking-widest text-slate-900 uppercase">Capability Snapshot</h2>
            <Link to="/manager/teams" className="text-[10px] font-bold tracking-widest text-purple-600 uppercase hover:text-purple-700">View All Teams ?</Link>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-5 py-3 text-[10px] font-bold tracking-widest text-slate-500 uppercase">Team</th>
                  <th className="px-5 py-3 text-[10px] font-bold tracking-widest text-slate-500 uppercase">Competency</th>
                  <th className="px-5 py-3 text-[10px] font-bold tracking-widest text-slate-500 uppercase">Readiness</th>
                  <th className="px-5 py-3 text-[10px] font-bold tracking-widest text-slate-500 uppercase">Trend</th>
                  <th className="px-5 py-3 text-[10px] font-bold tracking-widest text-slate-500 uppercase">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {executiveData.teams.map(team => (
                  <tr key={team.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3 text-sm font-bold text-slate-900">{team.name}</td>
                    <td className="px-5 py-3 text-sm text-slate-500">{team.competency}%</td>
                    <td className="px-5 py-3 text-sm font-medium text-slate-900">{team.readiness}%</td>
                    <td className="px-5 py-3 text-sm text-slate-500 flex items-center gap-1">
                      {team.trendDir === 'up' ? <TrendingUp size={14} className="text-emerald-500" /> : <TrendingDown size={14} className="text-rose-500" />}
                      <span className={team.trendDir === 'up' ? 'text-emerald-600' : 'text-rose-600'}>{team.trend}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-md ${team.status === 'Healthy' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                        {team.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 5. CAPACITY AI EXECUTIVE INSIGHT */}
        <section className="lg:col-span-1">
          <h2 className="text-sm font-bold tracking-widest text-slate-900 uppercase mb-4 flex items-center gap-2">
            <Brain size={16} className="text-purple-600" /> Executive Insight
          </h2>
          <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 rounded-xl p-1 shadow-md relative overflow-hidden h-[calc(100%-2rem)]">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
               <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500 rounded-full mix-blend-screen filter blur-xl"></div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-5 h-full flex flex-col relative z-10 border border-white/10">
              <span className="inline-block px-2 py-1 bg-white/20 rounded text-[10px] font-bold tracking-widest uppercase text-white mb-4 w-fit">
                Capacity AI
              </span>
              
              <h3 className="text-lg font-medium text-white mb-2 leading-tight">
                {executiveData.aiInsight.title}
              </h3>
              
              <p className="text-sm text-purple-200 mb-6 flex-1">
                {executiveData.aiInsight.description}
              </p>
              
              <div className="bg-black/20 rounded-lg p-3 mb-4 border border-white/10">
                <span className="block text-[10px] font-bold tracking-widest uppercase text-purple-300 mb-1">Business Impact</span>
                <p className="text-sm text-white font-medium">{executiveData.aiInsight.impact}</p>
              </div>
              
              <div className="bg-white/50 border border-violet-100 rounded-lg p-3 mb-4">
                <span className="block text-[10px] font-bold tracking-widest uppercase text-violet-600 mb-1">Recommended Action</span>
                <p className="text-sm text-slate-800 font-medium">{executiveData.aiInsight.recommendation}</p>
              </div>
              
              <Link to="/manager/capabilities" className="block text-center w-full py-2 bg-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.5)] text-white rounded-md text-xs font-bold tracking-widest uppercase hover:bg-purple-700 shadow-sm transition-colors">
                Explore Intelligence
              </Link>
            </div>
          </div>
        </section>
      </div>
      
    </div>
  );
};
