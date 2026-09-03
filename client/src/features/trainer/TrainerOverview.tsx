// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, BookOpen, CheckCircle, AlertTriangle, Clock, 
  TrendingUp, TrendingDown, Brain, Activity, Target,
  Bell, Plus, ChevronRight, MessageCircle, Presentation, Beaker, Trophy, Calendar
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Link } from 'react-router-dom';

const mockData = {
  kpis: {
    activeLearners: 124,
    activeCourses: 8,
    completionRate: 78,
    avgAssessment: 74,
    needAttention: 12,
    pendingReviews: 8
  },
  priorities: [
    { id: 1, type: 'critical', name: 'Priya Sharma', issue: 'Assessment score dropped by 24%', actionPrimary: 'Intervene', actionSecondary: 'View Learner' },
    { id: 2, type: 'warning', name: 'Rahul Desai', issue: 'Stuck on Module 4 for 3 days', actionPrimary: 'Message', actionSecondary: 'View Progress' },
    { id: 3, type: 'task', name: '8 Assignments', issue: 'Awaiting Review', actionPrimary: 'Review Now', actionSecondary: null },
    { id: 4, type: 'task', name: '4 Challenges', issue: 'Pending Evaluation', actionPrimary: 'Evaluate', actionSecondary: null }
  ],
  courses: [
    { id: 1, name: 'Backend Development', learners: 82, completion: 78, avgScore: 74, status: 'Performing Well' },
    { id: 2, name: 'Frontend Architecture', learners: 54, completion: 42, avgScore: 68, status: 'Needs Improvement' },
    { id: 3, name: 'Cloud Infrastructure', learners: 32, completion: 91, avgScore: 88, status: 'Excellent' }
  ],
  aiInsight: {
    topic: 'Database Normalization',
    percentage: 62,
    details: 'This topic has the highest assessment failure rate this week.'
  }
};

export const TrainerOverview = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
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
      
      {/* 1. HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">Trainer Operations Center</h1>
          <p className="text-sm text-slate-500">Welcome back. Here\'s what requires your attention today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold tracking-widest uppercase text-slate-600 hover:bg-slate-50 shadow-sm">
            <Calendar size={14} /> Today
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.5)] text-white rounded-lg text-xs font-bold tracking-widest uppercase hover:bg-purple-700 shadow-sm">
            <Plus size={14} /> Create
          </button>
        </div>
      </header>

      {/* 2. COMPACT KPI OVERVIEW */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Active Learners', value: mockData.kpis.activeLearners },
          { label: 'Active Courses', value: mockData.kpis.activeCourses },
          { label: 'Completion Rate', value: `${mockData.kpis.completionRate}%` },
          { label: 'Avg Assessment', value: `${mockData.kpis.avgAssessment}%` },
          { label: 'Need Attention', value: mockData.kpis.needAttention, highlight: true },
          { label: 'Pending Reviews', value: mockData.kpis.pendingReviews, highlight: true }
        ].map((kpi, idx) => (
          <div key={idx} className={`bg-white border ${kpi.highlight ? 'border-amber-200' : 'border-slate-200'} rounded-lg p-3 flex flex-col justify-center shadow-sm`}>
            <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-1">{kpi.label}</span>
            <span className={`text-xl font-medium ${kpi.highlight ? 'text-amber-600' : 'text-slate-900'}`}>{kpi.value}</span>
          </div>
        ))}
      </section>

      {/* 3. TODAY'S PRIORITIES */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold tracking-widest text-slate-900 uppercase flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-500" />
            Today\'s Priorities
          </h2>
          <Link to="/trainer/learners" className="text-[10px] font-bold tracking-widest text-purple-600 uppercase hover:text-purple-700">View Attention Queue ?</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockData.priorities.map(p => (
            <div key={p.id} className={`bg-white border rounded-xl p-5 shadow-sm flex flex-col ${p.type === 'critical' ? 'border-red-200' : p.type === 'warning' ? 'border-amber-200' : 'border-slate-200'}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-slate-900 line-clamp-1">{p.name}</h3>
                  <p className="text-xs font-medium text-slate-500 mt-1 line-clamp-2">{p.issue}</p>
                </div>
              </div>
              <div className="mt-auto pt-4 flex gap-2">
                <button className={`flex-1 text-[10px] font-bold tracking-widest uppercase py-2 rounded-lg transition-colors ${p.type === 'critical' ? 'bg-red-50 text-red-700 hover:bg-red-100' : p.type === 'warning' ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'}`}>
                  {p.actionPrimary}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. QUICK COURSE SNAPSHOT */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold tracking-widest text-slate-900 uppercase">Active Courses</h2>
          <Link to="/trainer/courses" className="text-[10px] font-bold tracking-widest text-purple-600 uppercase hover:text-purple-700">View All Courses ?</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockData.courses.map(course => (
            <Link key={course.id} to={`/trainer/courses/${course.id}`} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-purple-300 hover:shadow-md transition-all cursor-pointer">
              <h3 className="font-bold text-slate-900 mb-4">{course.name}</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1">Learners</p>
                  <p className="text-lg font-medium text-slate-900">{course.learners}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1">Completion</p>
                  <p className="text-lg font-medium text-slate-900">{course.completion}%</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${course.completion > 80 ? 'bg-emerald-500' : course.completion < 50 ? 'bg-amber-500' : 'bg-blue-500'}`}></span>
                <span className="text-xs font-medium text-slate-600">{course.status}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. AI INSIGHT */}
      <section>
        <div className="bg-gradient-to-r from-purple-900 to-slate-900 rounded-xl p-6 shadow-md relative overflow-hidden text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Brain size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-purple-500/30 border border-purple-400/30 rounded text-[10px] font-bold tracking-widest uppercase text-purple-200">
                Capacity AI Insight
              </span>
            </div>
            <h3 className="text-lg font-medium text-purple-50">{mockData.aiInsight.topic} has a <span className="text-white font-bold">{mockData.aiInsight.percentage}%</span> failure rate this week.</h3>
            <p className="text-sm text-purple-200 mt-1">{mockData.aiInsight.details}</p>
          </div>
          <Link to="/trainer/insights" className="relative z-10 shrink-0 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs font-bold tracking-widest uppercase text-white transition-all text-center">
            Explore Insights
          </Link>
        </div>
      </section>

    </div>
  );
};
