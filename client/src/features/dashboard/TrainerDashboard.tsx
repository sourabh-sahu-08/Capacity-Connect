// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, BookOpen, CheckCircle, AlertTriangle, Clock, 
  TrendingUp, TrendingDown, Brain, Activity, Target,
  Bell, Plus, ChevronRight, MessageCircle, Presentation, Beaker, Trophy, Calendar
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

// --- MOCK DATA LAYER ---
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
  },
  learnerSnapshots: {
    'Top Performers': [
      { id: 1, name: 'Rahul Desai', course: 'Backend Dev', progress: 92, score: 88, status: 'Excellent' },
      { id: 2, name: 'Priya Sharma', course: 'Frontend Arch', progress: 76, score: 91, status: 'Good' }
    ],
    'Most Improved': [
      { id: 3, name: 'Neha Gupta', course: 'Cloud Infra', progress: 85, score: 95, status: 'Accelerating' }
    ],
    'At Risk': [
      { id: 4, name: 'Aman Singh', course: 'Backend Dev', progress: 42, score: 54, status: 'Falling Behind' }
    ]
  },
  assessmentOverview: { upcoming: 3, avgScore: 74, passRate: 81, difficultTopic: 'JWT Authentication', pendingReviews: 6 },
  activePrograms: [
    { id: 1, name: 'FULL STACK DEVELOPMENT', learners: 124, progress: 68, nextSession: 'Tomorrow • 10:00 AM' }
  ],
  notifications: [
    { id: 1, text: 'Rahul has been inactive for 7 days', type: 'warning' },
    { id: 2, text: 'Priya submitted Backend Challenge', type: 'info' }
  ],
  impactMetrics: { trained: 248, improvement: '+18%', validated: 426, successRate: 84, impactScore: 92 }
};

export const TrainerDashboard = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [activeSnapshotTab, setActiveSnapshotTab] = useState('Top Performers');
  const [activeSecondaryTab, setActiveSecondaryTab] = useState('Assessment Overview');

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
    <div className="space-y-32 pb-32 pt-10 font-sans selection:bg-purple-500/30">
      
      {/* HERO / OPERATIONS CORE */}
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
            Trainer Operations Center
          </h2>
          <h1 className="text-sm font-medium tracking-[0.3em] text-slate-700 uppercase">
            Orchestrating learning experiences
          </h1>
        </motion.div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="text-[10rem] md:text-[12rem] font-light leading-none tracking-tighter bg-clip-text text-transparent bg-linear-to-b from-slate-900 to-slate-500">
            {mockData.kpis.activeLearners}
          </div>
          <div className="text-sm font-bold tracking-[0.2em] text-purple-600 mt-4 uppercase">
            Active Learners
          </div>
          <div className="text-xs tracking-widest text-emerald-600/80 mt-2 font-medium uppercase">
            +12 THIS WEEK
          </div>
        </div>

        {/* Constellation Nodes for Trainer */}
        <div className="absolute inset-0 pointer-events-none">
          {[
            { id: '1', x: '50%', y: '10%', label: 'Reviews (8)' },
            { id: '2', x: '80%', y: '50%', label: 'Courses (3)' },
            { id: '3', x: '50%', y: '90%', label: 'Interventions (4)' },
            { id: '4', x: '20%', y: '50%', label: 'Assessments (12)' },
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
              <AlertTriangle size={14} className="text-violet-600" /> Critical Intervention
            </h3>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-slate-900 leading-tight">
              Priya Sharma
            </h2>
            <p className="text-slate-600 max-w-md text-lg leading-relaxed">
              Assessment score dropped by <strong className="text-slate-900 font-medium">24%</strong> in Backend Architecture. Immediate mentoring suggested.
            </p>
          </div>
          <div className="shrink-0 flex flex-col items-end gap-6">
            <div className="text-sm font-medium tracking-widest text-slate-500 uppercase">
              Priority: High
            </div>
            <button className="group flex items-center gap-4 bg-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.5)] hover:bg-purple-700 text-white px-8 py-4 rounded-full transition-all shadow-sm">
              <span className="text-sm font-bold tracking-widest uppercase">Intervene Now</span>
              <MessageCircle size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* HORIZONTAL TIMELINE / WORKFLOW */}
      <section className="border-t border-slate-100 pt-20">
        <h3 className="text-xs font-bold tracking-[0.2em] text-slate-500 uppercase mb-16">
          Trainer Workflow
        </h3>
        
        <div className="relative">
          <div className="absolute top-4 left-0 right-0 h-px bg-slate-200"></div>
          
          <div className="grid grid-cols-3 gap-8 relative z-10">
            {/* COMPLETED */}
            <div className="space-y-6">
              <div className="w-8 h-8 rounded-full bg-white border border-slate-300 flex items-center justify-center mx-auto md:mx-0">
                <div className="w-2 h-2 rounded-full bg-zinc-600"></div>
              </div>
              <div>
                <div className="text-xs font-medium tracking-[0.2em] text-slate-500 uppercase mb-2">Evaluated</div>
                <h4 className="text-lg font-medium text-slate-600">14 Assignments</h4>
                <div className="text-xs tracking-widest text-emerald-600/70 mt-2 uppercase">Completed Today</div>
              </div>
            </div>

            {/* NOW */}
            <div className="space-y-6">
              <div className="w-8 h-8 rounded-full bg-purple-50 border border-purple-500/50 flex items-center justify-center mx-auto md:mx-0 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
              </div>
              <div>
                <div className="text-xs font-medium tracking-[0.2em] text-purple-600 uppercase mb-2">Pending</div>
                <h4 className="text-lg font-medium text-slate-900">8 Reviews</h4>
                <div className="text-xs tracking-widest text-slate-600 mt-2 uppercase">Requires Attention</div>
              </div>
            </div>

            {/* FUTURE */}
            <div className="space-y-6">
              <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center mx-auto md:mx-0">
                <div className="w-2 h-2 rounded-full border border-slate-300"></div>
              </div>
              <div>
                <div className="text-xs font-medium tracking-[0.2em] text-slate-500 uppercase mb-2">Upcoming</div>
                <h4 className="text-lg font-medium text-slate-500">Live Workshop</h4>
                <div className="text-xs tracking-widest text-slate-500 mt-2 uppercase">Tomorrow, 10:00 AM</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INSIGHTS AS STORIES */}
      <section className="border-t border-slate-100 pt-20">
        <h3 className="text-xs font-bold tracking-[0.2em] text-slate-500 uppercase mb-12">
          Cohort Story
        </h3>
        
        <div className="group cursor-pointer">
          <div className="text-[6rem] md:text-[8rem] font-light leading-none tracking-tighter text-slate-900 mb-8 group-hover:text-purple-100 transition-colors">
            {mockData.kpis.completionRate}%
          </div>
          <div className="max-w-2xl space-y-6">
            <h4 className="text-xl md:text-2xl font-light text-slate-700 leading-relaxed">
              Overall completion rate across all active cohorts. The highest momentum is currently in <strong className="text-slate-900 font-medium">Cloud Infrastructure</strong>.
            </h4>
            <div className="flex items-center gap-2 text-sm font-bold tracking-widest text-purple-600 uppercase group-hover:text-purple-700 transition-colors">
              Explore Analytics <ChevronRight size={16} />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
