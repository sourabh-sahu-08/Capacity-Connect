const fs = require('fs');

const content = `import React, { useState, useEffect } from 'react';
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
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-32">
      
      {/* 1. EXECUTIVE HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">Workforce Intelligence</h1>
          <p className="text-sm text-slate-500">A real-time overview of your organization\\'s capability and readiness.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold tracking-widest uppercase text-slate-600 hover:bg-slate-50 shadow-sm">
            <Building2 size={14} /> Team
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold tracking-widest uppercase text-slate-600 hover:bg-slate-50 shadow-sm">
            <Filter size={14} /> Dept
          </button>
          <div className="h-6 w-px bg-slate-200 mx-1"></div>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold tracking-widest uppercase text-slate-700 hover:bg-slate-200 shadow-sm">
            <Calendar size={14} /> {timeframe}
          </button>
        </div>
      </header>

      {/* 2. ORGANIZATION HEALTH OVERVIEW */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Active Learners', value: executiveData.health.activeLearners },
          { label: 'Avg Competency', value: \`\${executiveData.health.avgCompetency}%\` },
          { label: 'Workforce Readiness', value: \`\${executiveData.health.readiness}%\` },
          { label: 'Completion', value: \`\${executiveData.health.completion}%\` },
          { label: 'Teams At Risk', value: executiveData.health.teamsAtRisk, alert: true },
          { label: 'Critical Gaps', value: executiveData.health.criticalGaps, alert: true }
        ].map((kpi, idx) => (
          <div key={idx} className={\`bg-white border \${kpi.alert ? 'border-amber-200' : 'border-slate-200'} rounded-lg p-3 flex flex-col justify-center shadow-sm\`}>
            <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-1">{kpi.label}</span>
            <span className={\`text-xl font-medium \${kpi.alert ? 'text-amber-600' : 'text-slate-900'}\`}>{kpi.value}</span>
          </div>
        ))}
      </section>

      {/* 3. STRATEGIC ATTENTION */}
      <section>
        <h2 className="text-sm font-bold tracking-widest text-slate-900 uppercase mb-4 flex items-center gap-2">
          <ShieldAlert size={16} className="text-rose-500" /> Strategic Attention
        </h2>
        <div className="bg-white border border-rose-200 rounded-xl shadow-sm overflow-hidden divide-y divide-slate-100">
          {executiveData.strategicAttention.map((item) => (
            <div key={item.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle size={14} className={item.risk === 'HIGH' ? 'text-rose-500' : 'text-amber-500'} />
                  <h3 className="font-bold text-slate-900 text-sm">{item.target}</h3>
                </div>
                <p className="text-sm text-slate-600 ml-6">{item.issue}</p>
              </div>
              <div className="flex items-center justify-between md:justify-end gap-6 md:w-1/3">
                {item.readiness && (
                  <div className="text-left">
                    <span className="block text-[10px] font-bold tracking-widest uppercase text-slate-400">Readiness</span>
                    <span className="text-sm font-medium text-slate-900">{item.readiness}%</span>
                  </div>
                )}
                <div className="text-left">
                  <span className="block text-[10px] font-bold tracking-widest uppercase text-slate-400">Risk</span>
                  <span className={\`text-xs font-bold tracking-widest uppercase \${item.risk === 'HIGH' ? 'text-rose-600' : 'text-amber-600'}\`}>
                    {item.risk}
                  </span>
                </div>
                <button className="px-4 py-1.5 bg-white border border-slate-200 rounded-md text-[10px] font-bold tracking-widest uppercase text-slate-600 hover:bg-slate-50 shadow-sm shrink-0">
                  {item.actionLabel}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 4. TEAM CAPABILITY OVERVIEW */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold tracking-widest text-slate-900 uppercase">Team Capability Overview</h2>
            <button className="text-[10px] font-bold tracking-widest text-indigo-600 uppercase hover:text-indigo-700">View All Teams →</button>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100">
              {executiveData.teams.map(team => (
                <div key={team.id} className="p-5 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium text-slate-900">{team.name}</h3>
                      <p className="text-xs text-slate-500">{team.members} Members</p>
                    </div>
                    <span className={\`px-2 py-1 rounded text-[9px] font-bold tracking-widest uppercase \${team.status === 'Healthy' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}\`}>
                      {team.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <div>
                      <span className="text-slate-500 mr-2">Competency:</span>
                      <span className="font-medium text-slate-900">{team.competency}%</span>
                    </div>
                    <div>
                      <span className="text-slate-500 mr-2">Readiness:</span>
                      <span className="font-medium text-slate-900">{team.readiness}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-slate-500 mr-1">Trend:</span>
                      {team.trendDir === 'up' ? <TrendingUp size={14} className="text-emerald-500" /> : <TrendingDown size={14} className="text-amber-500" />}
                      <span className={\`font-medium \${team.trendDir === 'up' ? 'text-emerald-600' : 'text-amber-600'}\`}>{team.trend}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. CRITICAL SKILL GAPS */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold tracking-widest text-slate-900 uppercase">Critical Capability Gaps</h2>
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden divide-y divide-slate-100">
            {executiveData.criticalGaps.map((gap, idx) => (
              <div key={gap.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-sm font-bold text-slate-400">{idx + 1}.</span>
                    <h3 className="font-medium text-slate-900">{gap.skill}</h3>
                  </div>
                  <p className="text-xs text-slate-500 ml-6">Affected Employees: {gap.affected}</p>
                </div>
                <div className="flex-1 text-center hidden sm:block">
                  <span className="block text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-1">Business Importance</span>
                  <span className="text-xs font-medium text-slate-700">{gap.importance}</span>
                </div>
                <div className="flex-1 text-right">
                  <span className="block text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-1">Gap Severity</span>
                  <span className={\`text-xs font-bold tracking-widest uppercase \${gap.severity === 'HIGH' ? 'text-rose-600' : 'text-amber-600'}\`}>{gap.severity}</span>
                </div>
                <div className="ml-4 shrink-0">
                  <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-[10px] font-bold tracking-widest uppercase text-slate-600 hover:bg-slate-50 shadow-sm">
                    Analyze
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        
        {/* 6. WORKFORCE READINESS */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold tracking-widest text-slate-900 uppercase">Role Readiness</h2>
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="space-y-6">
              {executiveData.roleReadiness.map(role => (
                <div key={role.id}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-900">{role.role}</span>
                    <span className="text-sm font-bold text-indigo-600">{role.readiness}%</span>
                  </div>
                  <div className="relative w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="absolute top-0 left-0 h-full bg-indigo-500 rounded-full" style={{ width: \`\${role.readiness}%\` }}></div>
                    {/* Target Marker */}
                    <div className="absolute top-0 h-full w-1 bg-slate-800 z-10" style={{ left: \`\${role.target}%\` }} title={\`Target: \${role.target}%\`}></div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 text-right">Target: {role.target}%</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. CAPACITY AI EXECUTIVE INSIGHT */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold tracking-widest text-slate-900 uppercase">AI Executive Insight</h2>
          <div className="bg-violet-50 border border-violet-200 rounded-xl p-6 shadow-sm relative overflow-hidden h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Brain size={16} className="text-violet-600" />
              <span className="text-xs font-bold tracking-widest text-violet-600 uppercase">✦ Capacity AI Insight</span>
            </div>
            
            <h3 className="text-lg font-medium text-slate-900 mb-2">{executiveData.aiInsight.title}</h3>
            <p className="text-sm text-slate-700 mb-6">{executiveData.aiInsight.description}</p>
            
            <div className="mt-auto space-y-4">
              <div className="bg-white/50 border border-violet-100 rounded-lg p-3">
                <span className="block text-[10px] font-bold tracking-widest uppercase text-violet-600 mb-1">Projected Impact</span>
                <p className="text-sm text-slate-800 font-medium">{executiveData.aiInsight.impact}</p>
              </div>
              
              <div className="bg-white/50 border border-violet-100 rounded-lg p-3">
                <span className="block text-[10px] font-bold tracking-widest uppercase text-violet-600 mb-1">Recommended Action</span>
                <p className="text-sm text-slate-800 font-medium">{executiveData.aiInsight.recommendation}</p>
              </div>
              
              <button className="w-full py-2 bg-indigo-600 text-white rounded-md text-xs font-bold tracking-widest uppercase hover:bg-indigo-700 shadow-sm transition-colors">
                View Recommendation
              </button>
            </div>
          </div>
        </section>
        
      </div>

      {/* 8. WORKFORCE GROWTH ANALYTICS & 9. TEAM COMPARISON */}
      <section className="pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold tracking-widest text-slate-900 uppercase">Growth & Comparison</h2>
          <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
            {['7D', '30D', '90D', '1Y'].map(range => (
              <button 
                key={range} 
                onClick={() => setTimeframe(range)}
                className={\`px-3 py-1 rounded text-[10px] font-bold tracking-widest uppercase transition-colors \${timeframe === range ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}\`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center min-h-[220px]">
             <BarChart3 size={32} className="text-slate-300 mb-3" />
             <span className="text-xs font-bold tracking-widest text-slate-400 uppercase text-center">Competency Growth Trend<br/>[ Chart Placeholder ]</span>
          </div>
          
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-xs font-bold tracking-widest text-slate-600 uppercase">Team Comparison Matrix</h3>
            </div>
            <div className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-6 py-3 text-[10px] font-bold tracking-widest text-slate-500 uppercase bg-white sticky left-0 z-10">Metric</th>
                    <th className="px-6 py-3 text-[10px] font-bold tracking-widest text-slate-500 uppercase">Engineering</th>
                    <th className="px-6 py-3 text-[10px] font-bold tracking-widest text-slate-500 uppercase">Product</th>
                    <th className="px-6 py-3 text-[10px] font-bold tracking-widest text-slate-500 uppercase">Design</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50">
                    <td className="px-6 py-3 text-xs font-bold tracking-widest text-slate-500 uppercase bg-white sticky left-0 z-10">Competency</td>
                    <td className="px-6 py-3 text-sm font-medium text-slate-900">78%</td>
                    <td className="px-6 py-3 text-sm font-medium text-slate-900">64%</td>
                    <td className="px-6 py-3 text-sm font-medium text-slate-900">81%</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-6 py-3 text-xs font-bold tracking-widest text-slate-500 uppercase bg-white sticky left-0 z-10">Readiness</td>
                    <td className="px-6 py-3 text-sm font-medium text-slate-900">72%</td>
                    <td className="px-6 py-3 text-sm font-medium text-slate-900">58%</td>
                    <td className="px-6 py-3 text-sm font-medium text-slate-900">84%</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-6 py-3 text-xs font-bold tracking-widest text-slate-500 uppercase bg-white sticky left-0 z-10">Growth</td>
                    <td className="px-6 py-3 text-sm font-medium text-emerald-600">+8%</td>
                    <td className="px-6 py-3 text-sm font-medium text-emerald-600">+3%</td>
                    <td className="px-6 py-3 text-sm font-medium text-emerald-600">+11%</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-6 py-3 text-xs font-bold tracking-widest text-slate-500 uppercase bg-white sticky left-0 z-10">Risk</td>
                    <td className="px-6 py-3 text-xs font-bold tracking-widest uppercase text-amber-600">Medium</td>
                    <td className="px-6 py-3 text-xs font-bold tracking-widest uppercase text-rose-600">High</td>
                    <td className="px-6 py-3 text-xs font-bold tracking-widest uppercase text-emerald-600">Low</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 10. SECONDARY INFORMATION */}
      <section className="pt-10">
        <h2 className="text-sm font-bold tracking-widest text-slate-900 uppercase mb-4">Organizational Updates</h2>
        <div className="flex flex-wrap gap-2 mb-6">
          {['Activity', 'Initiatives', 'Milestones'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveSecondaryTab(tab)}
              className={\`px-4 py-2 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all \${activeSecondaryTab === tab ? 'bg-indigo-50 border border-indigo-200 text-indigo-600' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}\`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm min-h-[160px]">
          <AnimatePresence mode="wait">
            {activeSecondaryTab === 'Activity' && (
              <motion.div key="1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h3 className="text-xs font-bold tracking-widest text-slate-900 uppercase mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {executiveData.recentActivity.map(act => (
                    <div key={act.id} className="flex justify-between items-center pb-3 border-b border-slate-100 last:border-0">
                      <span className="text-sm text-slate-700">{act.text}</span>
                      <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">{act.time}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            {activeSecondaryTab === 'Initiatives' && (
              <motion.div key="2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center h-full pt-6">
                <span className="text-xs font-bold tracking-widest text-slate-400 uppercase text-center">No active upcoming initiatives.</span>
              </motion.div>
            )}
            {activeSecondaryTab === 'Milestones' && (
              <motion.div key="3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center h-full pt-6">
                <span className="text-xs font-bold tracking-widest text-slate-400 uppercase text-center">Organizational milestones will appear here.</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
      
    </div>
  );
};
`
fs.writeFileSync('client/src/features/dashboard/ManagerDashboard.tsx', content, 'utf8');
