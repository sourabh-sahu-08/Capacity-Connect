import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, BookOpen, CheckCircle, AlertTriangle, Clock, 
  TrendingUp, TrendingDown, Brain, Activity, Target,
  Bell, Plus, ChevronRight, MessageCircle, Presentation, Beaker, Trophy
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

// --- MOCK DATA LAYER ---
// In a real implementation, this would be fetched via an API service.
const mockData = {
  kpis: {
    activeLearners: 124,
    activeCourses: 8,
    completionRate: 78,
    avgAssessment: 74,
    needAttention: 12,
    pendingReviews: 8
  },
  attentionQueue: [
    { id: 1, name: 'Priya Sharma', avatar: 'PS', course: 'Backend Architecture', issue: 'Assessment score dropped by 24%', severity: 'HIGH', lastActive: '5 days ago', actionText: 'Take Action' },
    { id: 2, name: 'Rahul Desai', avatar: 'RD', course: 'React Fundamentals', issue: 'Stuck on Module 4 for 3 days', severity: 'MEDIUM', lastActive: '2 days ago', actionText: 'Send Message' },
    { id: 3, name: 'Aman Singh', avatar: 'AS', course: 'Database Normalization', issue: 'Failed assessment twice', severity: 'HIGH', lastActive: '1 day ago', actionText: 'Schedule Review' }
  ],
  coursePerformance: [
    { id: 1, name: 'Backend Development', enrollment: 82, completion: 78, active: 45, avgScore: 74, status: 'Performing Well' },
    { id: 2, name: 'Frontend Architecture', enrollment: 54, completion: 42, active: 30, avgScore: 68, status: 'Needs Improvement' },
    { id: 3, name: 'Cloud Infrastructure', enrollment: 32, completion: 91, active: 10, avgScore: 88, status: 'Excellent' }
  ],
  pendingActions: [
    { id: 1, type: 'assignment', count: 8, priority: 'high', label: 'Assignments awaiting review', icon: CheckCircle },
    { id: 2, type: 'challenge', count: 4, priority: 'medium', label: 'Challenges submitted', icon: Beaker },
    { id: 3, type: 'mentorship', count: 2, priority: 'low', label: 'Mentorship requests', icon: Users },
    { id: 4, type: 'questions', count: 6, priority: 'high', label: 'Learner questions pending', icon: MessageCircle }
  ],
  aiInsights: {
    topic: 'Database Normalization',
    percentage: 62,
    details: 'This topic has the highest assessment failure rate across your current learners.',
    actions: ['Generate Practice Exercise', 'Review Course Content']
  },
  learnerSnapshot: [
    { id: 1, name: 'Rahul Desai', progress: 92, score: 88, category: 'Top Performers' },
    { id: 2, name: 'Priya Sharma', progress: 76, score: 91, category: 'Recently Active' },
    { id: 3, name: 'Aman Singh', progress: 42, score: 54, category: 'At Risk' },
    { id: 4, name: 'Neha Gupta', progress: 85, score: 95, category: 'Most Improved' }
  ],
  assessmentOverview: {
    upcoming: 3,
    avgScore: 74,
    passRate: 81,
    difficultTopic: 'JWT Authentication',
    pendingReviews: 6
  },
  activePrograms: [
    { id: 1, name: 'FULL STACK DEVELOPMENT', learners: 124, progress: 68, nextSession: 'Advanced Node.js', time: 'Tomorrow � 10:00 AM' },
    { id: 2, name: 'CLOUD NATIVE BOOTCAMP', learners: 45, progress: 32, nextSession: 'Docker & Kubernetes', time: 'Today � 2:00 PM' }
  ],
  notifications: [
    { id: 1, icon: AlertTriangle, text: 'Rahul has been inactive for 7 days', type: 'warning' },
    { id: 2, icon: CheckCircle, text: 'Priya submitted Backend Challenge', type: 'info' },
    { id: 3, icon: Trophy, text: 'Aman completed React Fundamentals', type: 'success' },
    { id: 4, icon: TrendingDown, text: 'Average assessment performance dropped by 8%', type: 'error' }
  ],
  impactMetrics: {
    trained: 248,
    improvement: '+18%',
    validated: 426,
    successRate: 84,
    impactScore: 92
  }
};

export const TrainerDashboard = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<typeof mockData | null>(null);

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading || !data) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium tracking-widest uppercase text-sm">Loading Command Center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-32">
      {/* HEADER */}
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-light tracking-tight text-slate-900">
          Trainer Operations Center
        </h1>
        <p className="text-slate-500">
          Welcome back, <span className="font-medium text-slate-700">{user?.firstName || 'Trainer'}</span>. Here is your operational overview.
        </p>
      </header>

      {/* 1. TRAINING OVERVIEW (KPIs) */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'ACTIVE LEARNERS', value: data.kpis.activeLearners, icon: Users, color: 'text-indigo-600' },
          { label: 'ACTIVE COURSES', value: data.kpis.activeCourses, icon: BookOpen, color: 'text-indigo-600' },
          { label: 'COMPLETION RATE', value: `${data.kpis.completionRate}%`, icon: CheckCircle, color: 'text-emerald-600' },
          { label: 'AVG ASSESSMENT', value: `${data.kpis.avgAssessment}%`, icon: Target, color: 'text-indigo-600' },
          { label: 'NEED ATTENTION', value: data.kpis.needAttention, icon: AlertTriangle, color: 'text-amber-600' },
          { label: 'PENDING REVIEWS', value: data.kpis.pendingReviews, icon: Clock, color: 'text-slate-700' }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:-translate-y-0.5 transition-transform">
            <div className="flex items-center gap-2 mb-3 opacity-80">
              <kpi.icon size={16} className={kpi.color} />
              <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase truncate">
                {kpi.label}
              </span>
            </div>
            <div className="text-3xl font-light text-slate-900">{kpi.value}</div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: CRITICAL ACTIONS (2/3 width) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 2. LEARNER ATTENTION QUEUE */}
          <section className="bg-white border border-red-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-red-50 px-6 py-4 border-b border-red-200 flex items-center gap-3">
              <AlertTriangle className="text-red-600" size={18} />
              <h2 className="text-sm font-bold tracking-widest text-red-600 uppercase">Attention Required</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {data.attentionQueue.map((learner) => (
                <div key={learner.id} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold shrink-0">
                      {learner.avatar}
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900">{learner.name}</h3>
                      <p className="text-xs text-slate-500 mt-1">{learner.course}</p>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-700 font-medium">{learner.issue}</p>
                    <div className="flex gap-3 mt-1">
                      <span className={`text-[10px] font-bold tracking-widest uppercase ${learner.severity === 'HIGH' ? 'text-red-600' : 'text-amber-600'}`}>
                        SEVERITY: {learner.severity}
                      </span>
                      <span className="text-[10px] tracking-widest uppercase text-slate-400">
                        ACTIVE: {learner.lastActive}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 flex gap-2 w-full md:w-auto">
                    <button className="flex-1 md:flex-none px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold tracking-widest uppercase text-slate-600 hover:bg-slate-50">
                      View
                    </button>
                    <button className="flex-1 md:flex-none px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold tracking-widest uppercase hover:bg-indigo-700">
                      {learner.actionText}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 5. AI TRAINING INSIGHTS */}
          <section className="bg-violet-50 border border-violet-200 rounded-2xl p-8 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-6 relative z-10">
              <Brain size={16} className="text-violet-600" />
              <h3 className="text-xs font-bold tracking-[0.2em] text-violet-600 uppercase">? Capacity AI Insight</h3>
            </div>
            <div className="relative z-10 max-w-2xl">
              <h4 className="text-2xl font-light text-slate-900 mb-4">
                <strong className="font-medium">{data.aiInsights.percentage}%</strong> of learners are struggling with <strong className="font-medium">{data.aiInsights.topic}</strong>.
              </h4>
              <p className="text-slate-600 mb-8">{data.aiInsights.details}</p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <p className="text-xs font-bold tracking-widest uppercase text-violet-600 sm:self-center mr-2">Recommended:</p>
                {data.aiInsights.actions.map((action, idx) => (
                  <button key={idx} className="px-4 py-2 bg-white text-indigo-600 border border-violet-200 rounded-lg text-xs font-bold tracking-widest uppercase hover:bg-violet-100 transition-colors shadow-sm">
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* 3. COURSE PERFORMANCE */}
          <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold tracking-widest text-slate-900 uppercase">Course Performance</h2>
              <button className="text-xs font-bold tracking-widest text-indigo-600 uppercase hover:text-indigo-700">View All</button>
            </div>
            <div className="p-6 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="pb-3 text-xs font-bold tracking-widest text-slate-500 uppercase">Course</th>
                    <th className="pb-3 text-xs font-bold tracking-widest text-slate-500 uppercase">Learners</th>
                    <th className="pb-3 text-xs font-bold tracking-widest text-slate-500 uppercase">Completion</th>
                    <th className="pb-3 text-xs font-bold tracking-widest text-slate-500 uppercase">Avg Score</th>
                    <th className="pb-3 text-xs font-bold tracking-widest text-slate-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.coursePerformance.map(course => (
                    <tr key={course.id} className="group hover:bg-slate-50">
                      <td className="py-4 font-medium text-slate-900">{course.name}</td>
                      <td className="py-4 text-sm text-slate-600">{course.enrollment}</td>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: `${course.completion}%` }}></div>
                          </div>
                          <span className="text-sm text-slate-700">{course.completion}%</span>
                        </div>
                      </td>
                      <td className="py-4 text-sm text-slate-600">{course.avgScore}%</td>
                      <td className="py-4">
                        <span className="inline-flex px-2 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase bg-slate-100 text-slate-600">
                          {course.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 6 & 7. LEARNER SNAPSHOT & ANALYTICS (2 columns) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-sm font-bold tracking-widest text-slate-900 uppercase mb-6">Learner Snapshot</h2>
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {['Recently Active', 'Top Performers', 'Most Improved', 'At Risk'].map(tab => (
                  <button key={tab} className={`shrink-0 px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase rounded-full ${tab === 'Top Performers' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                    {tab}
                  </button>
                ))}
              </div>
              <div className="space-y-4 mt-6">
                {data.learnerSnapshot.map(learner => (
                  <div key={learner.id} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">{learner.name}</span>
                    <div className="flex items-center gap-4 text-xs font-bold tracking-widest uppercase">
                      <span className="text-emerald-600">{learner.progress}% <span className="text-slate-400">PROG</span></span>
                      <span className="text-indigo-600">{learner.score}% <span className="text-slate-400">SCR</span></span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            
            <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-bold tracking-widest text-slate-900 uppercase">Performance Analytics</h2>
                <select className="text-xs font-bold tracking-widest uppercase text-slate-500 bg-transparent outline-none cursor-pointer">
                  <option>30 Days</option>
                  <option>90 Days</option>
                </select>
              </div>
              <div className="flex-1 border border-slate-100 rounded-xl bg-slate-50 flex items-center justify-center p-4">
                <p className="text-xs text-slate-400 font-medium tracking-widest uppercase text-center">
                  [ Lightweight Chart Placeholder ]<br/><br/>Shows engagement and score trends over time.
                </p>
              </div>
            </section>
          </div>


          {/* 9. ACTIVE TRAINING PROGRAMS */}
          <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold tracking-widest text-slate-900 uppercase">Active Training Programs</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {data.activePrograms.map(program => (
                <div key={program.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50 transition-colors">
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 tracking-widest uppercase text-sm mb-1">{program.name}</h3>
                    <p className="text-slate-500 text-sm">{program.learners} Learners</p>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold tracking-widest uppercase text-slate-500">Overall Progress</span>
                      <span className="text-sm font-medium text-slate-700">{program.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500" style={{ width: `${program.progress}%` }}></div>
                    </div>
                  </div>

                  <div className="flex-1 md:text-right border-l-0 md:border-l border-slate-200 md:pl-6">
                    <span className="block text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-1">Next Session</span>
                    <span className="block text-sm font-medium text-slate-900">{program.nextSession}</span>
                    <span className="block text-xs text-indigo-600 font-medium mt-1">{program.time}</span>
                  </div>

                  <div className="shrink-0">
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold tracking-widest uppercase text-slate-600 hover:bg-slate-50">
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>


        {/* RIGHT COLUMN: OPERATIONS & SIDE PANELS (1/3 width) */}
        <div className="space-y-8">
          
          {/* 4. PENDING ACTIONS */}
          <section className="bg-indigo-600 rounded-2xl p-6 shadow-md text-white">
            <h2 className="text-sm font-bold tracking-widest uppercase mb-6 flex items-center gap-2">
              <Clock size={16} className="text-indigo-200" /> Pending Actions
            </h2>
            <div className="space-y-4">
              {data.pendingActions.map(action => (
                <div key={action.id} className="bg-indigo-700/50 border border-indigo-500/50 rounded-xl p-4 flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <action.icon size={18} className="text-indigo-300 shrink-0 mt-0.5" />
                      <div>
                        <span className="block text-lg font-light leading-none mb-1">{action.count}</span>
                        <span className="text-xs text-indigo-100 font-medium">{action.label}</span>
                      </div>
                    </div>
                  </div>
                  <button className="w-full py-2 bg-white text-indigo-600 rounded-lg text-[10px] font-bold tracking-widest uppercase hover:bg-indigo-50 transition-colors">
                    Action Required
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* 11. QUICK ACTIONS */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-bold tracking-widest text-slate-900 uppercase mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Create Course', icon: Plus },
                { label: 'Create Assessment', icon: Target },
                { label: 'Create Challenge', icon: Beaker },
                { label: 'Upload Resource', icon: BookOpen },
                { label: 'Assign Content', icon: ChevronRight },
                { label: 'Schedule Session', icon: Presentation }
              ].map((action, idx) => (
                <button key={idx} className="flex flex-col items-center justify-center p-4 border border-slate-100 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:border-indigo-100 hover:text-indigo-600 transition-colors gap-2 text-slate-600 group">
                  <action.icon size={18} className="group-hover:text-indigo-600 transition-colors" />
                  <span className="text-[10px] font-bold tracking-widest uppercase text-center">{action.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* 8. ASSESSMENT OVERVIEW */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-bold tracking-widest text-slate-900 uppercase mb-6">Assessment Overview</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-sm text-slate-600">Upcoming Assessments</span>
                <span className="font-medium text-slate-900">{data.assessmentOverview.upcoming}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-sm text-slate-600">Pass Rate</span>
                <span className="font-medium text-emerald-600">{data.assessmentOverview.passRate}%</span>
              </div>
              <div className="flex flex-col gap-1 py-2 border-b border-slate-100">
                <span className="text-xs font-bold tracking-widest uppercase text-slate-500">Most Difficult Topic</span>
                <span className="font-medium text-slate-900">{data.assessmentOverview.difficultTopic}</span>
              </div>
            </div>
          </section>

          {/* 12. TRAINER IMPACT METRICS */}
          <section className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10"><Trophy size={100} /></div>
            <h2 className="text-sm font-bold tracking-widest uppercase mb-6 text-slate-300 relative z-10">Your Training Impact</h2>
            
            <div className="grid grid-cols-2 gap-y-6 relative z-10">
              <div>
                <div className="text-3xl font-light mb-1">{data.impactMetrics.trained}</div>
                <div className="text-[10px] font-bold tracking-widest uppercase text-slate-400">Learners Trained</div>
              </div>
              <div>
                <div className="text-3xl font-light mb-1 text-emerald-400">{data.impactMetrics.improvement}</div>
                <div className="text-[10px] font-bold tracking-widest uppercase text-slate-400">Avg Improvement</div>
              </div>
              <div>
                <div className="text-3xl font-light mb-1">{data.impactMetrics.validated}</div>
                <div className="text-[10px] font-bold tracking-widest uppercase text-slate-400">Skills Validated</div>
              </div>
              <div>
                <div className="text-3xl font-light mb-1 text-indigo-300">{data.impactMetrics.impactScore}</div>
                <div className="text-[10px] font-bold tracking-widest uppercase text-slate-400">Impact Score</div>
              </div>
            </div>
          </section>

          {/* 10. SMART NOTIFICATIONS */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-bold tracking-widest text-slate-900 uppercase mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {data.notifications.map(notif => (
                <div key={notif.id} className="flex gap-3 items-start">
                  <div className={`mt-0.5 p-1.5 rounded-md shrink-0 ${notif.type === 'warning' ? 'bg-amber-100 text-amber-600' : notif.type === 'error' ? 'bg-red-100 text-red-600' : notif.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'}`}>
                    <notif.icon size={12} />
                  </div>
                  <p className="text-sm text-slate-600 leading-snug">{notif.text}</p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

