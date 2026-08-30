const fs = require('fs');
const content = `import React, { useState, useEffect } from 'react';
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
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-32">
      
      {/* 1. HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">Trainer Operations Center</h1>
          <p className="text-sm text-slate-500">Welcome back. Here\\'s what requires your attention today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold tracking-widest uppercase text-slate-600 hover:bg-slate-50 shadow-sm">
            <Calendar size={14} /> Today
          </button>
          <button className="flex items-center justify-center w-9 h-9 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 hover:border-indigo-200 shadow-sm relative">
            <Bell size={16} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold tracking-widest uppercase hover:bg-indigo-700 shadow-sm">
            <Plus size={14} /> Create
          </button>
        </div>
      </header>

      {/* 2. COMPACT KPI OVERVIEW */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Active Learners', value: mockData.kpis.activeLearners },
          { label: 'Active Courses', value: mockData.kpis.activeCourses },
          { label: 'Completion Rate', value: \`\${mockData.kpis.completionRate}%\` },
          { label: 'Avg Assessment', value: \`\${mockData.kpis.avgAssessment}%\` },
          { label: 'Need Attention', value: mockData.kpis.needAttention, highlight: true },
          { label: 'Pending Reviews', value: mockData.kpis.pendingReviews, highlight: true }
        ].map((kpi, idx) => (
          <div key={idx} className={\`bg-white border \${kpi.highlight ? 'border-amber-200' : 'border-slate-200'} rounded-lg p-3 flex flex-col justify-center shadow-sm\`}>
            <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-1">{kpi.label}</span>
            <span className={\`text-xl font-medium \${kpi.highlight ? 'text-amber-600' : 'text-slate-900'}\`}>{kpi.value}</span>
          </div>
        ))}
      </section>

      {/* 3. TODAY'S PRIORITIES */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold tracking-widest text-slate-900 uppercase flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-500" /> Today\\'s Priorities
          </h2>
          <button className="text-xs font-bold tracking-widest text-indigo-600 uppercase hover:text-indigo-700">View All</button>
        </div>
        <div className="bg-white border border-red-200 rounded-xl shadow-sm overflow-hidden divide-y divide-slate-100">
          <div className="px-5 py-2 bg-red-50 text-[10px] font-bold tracking-widest text-red-600 uppercase">High Priority</div>
          {mockData.priorities.map((item) => (
            <div key={item.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
              <div className="flex-1">
                <h3 className="font-medium text-slate-900">{item.name}</h3>
                <p className="text-sm text-slate-500">{item.issue}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {item.actionSecondary && (
                  <button className="px-4 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-bold tracking-widest text-slate-600 uppercase hover:bg-slate-50 shadow-sm">
                    {item.actionSecondary}
                  </button>
                )}
                <button className="px-4 py-1.5 bg-indigo-600 text-white rounded-md text-xs font-bold tracking-widest uppercase hover:bg-indigo-700 shadow-sm">
                  {item.actionPrimary}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 4. COURSE PERFORMANCE */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold tracking-widest text-slate-900 uppercase">Course Performance</h2>
            <button className="text-xs font-bold tracking-widest text-indigo-600 uppercase hover:text-indigo-700">View All Courses →</button>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-5 py-3 text-[10px] font-bold tracking-widest text-slate-500 uppercase">Course</th>
                  <th className="px-5 py-3 text-[10px] font-bold tracking-widest text-slate-500 uppercase">Active</th>
                  <th className="px-5 py-3 text-[10px] font-bold tracking-widest text-slate-500 uppercase">Completion</th>
                  <th className="px-5 py-3 text-[10px] font-bold tracking-widest text-slate-500 uppercase">Avg Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockData.courses.map(course => (
                  <tr key={course.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3 text-sm font-medium text-slate-900">{course.name}</td>
                    <td className="px-5 py-3 text-sm text-slate-500">{course.learners}</td>
                    <td className="px-5 py-3 text-sm text-slate-500">{course.completion}%</td>
                    <td className="px-5 py-3 text-sm text-slate-500">{course.avgScore}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. AI TRAINING INSIGHT */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold tracking-widest text-slate-900 uppercase">Insights</h2>
            <button className="text-xs font-bold tracking-widest text-indigo-600 uppercase hover:text-indigo-700">View All →</button>
          </div>
          <div className="bg-violet-50 border border-violet-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Brain size={14} className="text-violet-600" />
              <span className="text-[10px] font-bold tracking-widest text-violet-600 uppercase">✦ Capacity AI Insight</span>
            </div>
            <p className="text-sm text-slate-900 leading-relaxed mb-4">
              <strong className="font-bold">{mockData.aiInsight.percentage}%</strong> of learners are struggling with <strong className="font-bold">{mockData.aiInsight.topic}</strong>. {mockData.aiInsight.details}
            </p>
            <div className="flex gap-2">
              <button className="flex-1 py-1.5 bg-white border border-violet-200 text-indigo-600 rounded-md text-[10px] font-bold tracking-widest uppercase hover:bg-violet-100 shadow-sm">
                View Analysis
              </button>
              <button className="flex-1 py-1.5 bg-indigo-600 text-white rounded-md text-[10px] font-bold tracking-widest uppercase hover:bg-indigo-700 shadow-sm">
                Take Action
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* 6. LEARNER SNAPSHOT */}
      <section className="space-y-4 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-sm font-bold tracking-widest text-slate-900 uppercase">Learner Snapshot</h2>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            {Object.keys(mockData.learnerSnapshots).map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveSnapshotTab(tab)}
                className={\`px-4 py-1.5 rounded-md text-[10px] font-bold tracking-widest uppercase transition-colors \${activeSnapshotTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}\`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-5 py-3 text-[10px] font-bold tracking-widest text-slate-500 uppercase">Learner</th>
                <th className="px-5 py-3 text-[10px] font-bold tracking-widest text-slate-500 uppercase">Course</th>
                <th className="px-5 py-3 text-[10px] font-bold tracking-widest text-slate-500 uppercase">Progress</th>
                <th className="px-5 py-3 text-[10px] font-bold tracking-widest text-slate-500 uppercase">Score</th>
                <th className="px-5 py-3 text-[10px] font-bold tracking-widest text-slate-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockData.learnerSnapshots[activeSnapshotTab as keyof typeof mockData.learnerSnapshots].map(learner => (
                <tr key={learner.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3 text-sm font-medium text-slate-900">{learner.name}</td>
                  <td className="px-5 py-3 text-sm text-slate-500">{learner.course}</td>
                  <td className="px-5 py-3 text-sm text-slate-500">{learner.progress}%</td>
                  <td className="px-5 py-3 text-sm text-slate-500">{learner.score}%</td>
                  <td className="px-5 py-3 text-sm text-slate-500">{learner.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-3 border-t border-slate-100 bg-slate-50 text-center">
            <button className="text-xs font-bold tracking-widest text-indigo-600 uppercase hover:text-indigo-700">View All Learners →</button>
          </div>
        </div>
      </section>

      {/* 7. PERFORMANCE ANALYTICS */}
      <section className="space-y-4 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold tracking-widest text-slate-900 uppercase">Performance Analytics</h2>
          <div className="flex gap-2">
            {['7D', '30D', '90D'].map(range => (
              <button key={range} className="text-[10px] font-bold tracking-widest text-slate-500 uppercase hover:text-indigo-600">{range}</button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center min-h-[160px]">
             <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">[ Engagement Trend Chart ]</span>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center min-h-[160px]">
             <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">[ Assessment Trend Chart ]</span>
          </div>
        </div>
      </section>

      {/* 8. SECONDARY INFORMATION */}
      <section className="pt-10">
        <h2 className="text-sm font-bold tracking-widest text-slate-900 uppercase mb-4">Training Insights</h2>
        <div className="flex flex-wrap gap-2 mb-6">
          {['Assessment Overview', 'Programs', 'Notifications', 'My Impact'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveSecondaryTab(tab)}
              className={\`px-4 py-2 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all \${activeSecondaryTab === tab ? 'bg-indigo-50 border border-indigo-200 text-indigo-600' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}\`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm min-h-[200px]">
          <AnimatePresence mode="wait">
            {activeSecondaryTab === 'Assessment Overview' && (
              <motion.div key="1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <h3 className="text-sm font-bold tracking-widest text-slate-900 uppercase mb-2">Assessment Overview</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Avg Score</p><p className="text-2xl font-light text-slate-900">{mockData.assessmentOverview.avgScore}%</p></div>
                  <div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Pass Rate</p><p className="text-2xl font-light text-emerald-600">{mockData.assessmentOverview.passRate}%</p></div>
                  <div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Pending</p><p className="text-2xl font-light text-amber-600">{mockData.assessmentOverview.pendingReviews}</p></div>
                  <div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Hardest Topic</p><p className="text-sm font-medium text-slate-900 mt-1 truncate">{mockData.assessmentOverview.difficultTopic}</p></div>
                </div>
              </motion.div>
            )}
            {activeSecondaryTab === 'Programs' && (
              <motion.div key="2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h3 className="text-sm font-bold tracking-widest text-slate-900 uppercase mb-4">Active Programs</h3>
                {mockData.activePrograms.map(p => (
                  <div key={p.id} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{p.name}</p>
                      <p className="text-xs text-slate-500">{p.learners} Learners</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400">Next Session</p>
                      <p className="text-sm font-medium text-indigo-600">{p.nextSession}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
            {activeSecondaryTab === 'Notifications' && (
              <motion.div key="3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h3 className="text-sm font-bold tracking-widest text-slate-900 uppercase mb-4">Smart Notifications</h3>
                <div className="space-y-3">
                  {mockData.notifications.map(n => (
                    <div key={n.id} className="flex items-center gap-3">
                      <div className={\`w-2 h-2 rounded-full \${n.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}\`}></div>
                      <p className="text-sm text-slate-600">{n.text}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            {activeSecondaryTab === 'My Impact' && (
              <motion.div key="4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h3 className="text-sm font-bold tracking-widest text-slate-900 uppercase mb-4">Trainer Impact Metrics</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Trained</p><p className="text-2xl font-light text-slate-900">{mockData.impactMetrics.trained}</p></div>
                  <div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Improvement</p><p className="text-2xl font-light text-emerald-600">{mockData.impactMetrics.improvement}</p></div>
                  <div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Validated</p><p className="text-2xl font-light text-slate-900">{mockData.impactMetrics.validated}</p></div>
                  <div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Impact Score</p><p className="text-2xl font-light text-indigo-600">{mockData.impactMetrics.impactScore}/100</p></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
      
    </div>
  );
};
`;
fs.writeFileSync('client/src/features/dashboard/TrainerDashboard.tsx', content, 'utf8');
