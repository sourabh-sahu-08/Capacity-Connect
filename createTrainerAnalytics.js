const fs = require('fs');

const assessmentsList = `import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, FileText } from 'lucide-react';

export const AssessmentsList = () => {
  return (
    <div className="space-y-6 pb-32">
      <header className="border-b border-slate-200 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">Assessments</h1>
          <p className="text-sm text-slate-500">Manage quizzes, exams, and practical assignments.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-lg text-sm font-bold tracking-widest uppercase shadow-sm">
          <Plus className="w-4 h-4" /> Create Assessment
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total active', value: '12' },
          { label: 'Avg Score', value: '74%' },
          { label: 'Pending Evals', value: '8', alert: true },
          { label: 'Pass Rate', value: '81%' }
        ].map(kpi => (
          <div key={kpi.label} className={\`bg-white border \${kpi.alert ? 'border-amber-200' : 'border-slate-200'} rounded-lg p-4 shadow-sm\`}>
            <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">{kpi.label}</p>
            <p className={\`text-2xl font-medium mt-1 \${kpi.alert ? 'text-amber-600' : 'text-slate-900'}\`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-6 py-4 text-xs font-bold tracking-widest text-slate-500 uppercase">Assessment Name</th>
              <th className="px-6 py-4 text-xs font-bold tracking-widest text-slate-500 uppercase">Course</th>
              <th className="px-6 py-4 text-xs font-bold tracking-widest text-slate-500 uppercase">Submissions</th>
              <th className="px-6 py-4 text-xs font-bold tracking-widest text-slate-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[1, 2, 3, 4].map(i => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <Link to={\`/trainer/assessments/\${i}\`} className="font-medium text-purple-600 hover:text-purple-700">Module {i} Final Challenge</Link>
                </td>
                <td className="px-6 py-4 text-slate-500">Backend Development</td>
                <td className="px-6 py-4 text-slate-900 font-medium">32 / 40</td>
                <td className="px-6 py-4"><span className="px-2 py-1 text-[10px] font-bold uppercase rounded bg-emerald-50 text-emerald-700">Active</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
`;

const assessmentDetail = `import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';

export const AssessmentDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className="space-y-6 pb-32">
      <Link to="/trainer/assessments" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" /> Back to Assessments
      </Link>
      
      <header className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">Backend Development</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Module {id} Final Challenge</h1>
      </header>

      <div className="flex gap-2 border-b border-slate-200">
        {['Overview', 'Questions', 'Submissions', 'Analytics'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={\`px-4 py-3 text-sm font-medium border-b-2 transition-colors \${activeTab === tab ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-500 hover:text-slate-900'}\`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-8 min-h-[300px] flex items-center justify-center text-slate-500">
        <p className="font-medium">Content for {activeTab}</p>
      </div>
    </div>
  );
};
`;

const trainerAnalytics = `import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users } from 'lucide-react';

export const TrainerAnalytics = () => {
  const [range, setRange] = useState('30D');
  
  return (
    <div className="space-y-6 pb-32">
      <header className="border-b border-slate-200 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">Performance Analytics</h1>
          <p className="text-sm text-slate-500">Deep dive into learner engagement and course metrics.</p>
        </div>
        <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
          {['7D', '30D', '90D', 'Custom'].map(r => (
            <button key={r} onClick={() => setRange(r)} className={\`px-3 py-1 rounded text-xs font-bold tracking-widest uppercase \${range === r ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}\`}>
              {r}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm min-h-[300px] flex flex-col">
          <h3 className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-6">Learner Engagement Trend</h3>
          <div className="flex-1 border-2 border-dashed border-slate-100 rounded-lg flex items-center justify-center text-slate-400">
            [ Engagement Chart ]
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm min-h-[300px] flex flex-col">
          <h3 className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-6">Assessment Score Distribution</h3>
          <div className="flex-1 border-2 border-dashed border-slate-100 rounded-lg flex items-center justify-center text-slate-400">
            [ Distribution Chart ]
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm min-h-[300px] flex flex-col lg:col-span-2">
          <h3 className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-6">Course Completion Velocity</h3>
          <div className="flex-1 border-2 border-dashed border-slate-100 rounded-lg flex items-center justify-center text-slate-400">
            [ Velocity Chart ]
          </div>
        </div>
      </div>
    </div>
  );
};
`;

const trainerInsights = `import React from 'react';
import { Lightbulb, Target, Users, Zap } from 'lucide-react';

export const TrainerInsights = () => {
  return (
    <div className="space-y-6 pb-32">
      <header className="border-b border-slate-200 pb-6 flex items-center gap-3">
        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
          <Lightbulb size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">Capacity AI Insights</h1>
          <p className="text-sm text-slate-500">Actionable intelligence extracted from your training data.</p>
        </div>
      </header>

      <div className="grid gap-6">
        {[
          { title: "Database Normalization Struggle", desc: "62% failure rate on recent module.", affected: 14, action: "Schedule Review Session" },
          { title: "High Engagement on Frontend Tasks", desc: "React components module completed 20% faster than average.", affected: 42, action: "Advance Curriculum" }
        ].map((insight, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-purple-300 transition-all">
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 text-lg">{insight.title}</h3>
              <p className="text-slate-600">{insight.desc}</p>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-100 w-fit px-2 py-1 rounded">
                <Users size={14} /> {insight.affected} Learners Affected
              </div>
            </div>
            <button className="shrink-0 px-6 py-3 bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 rounded-lg text-sm font-bold uppercase tracking-widest transition-colors">
              {insight.action}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
`;

fs.writeFileSync('client/src/features/trainer/AssessmentsList.tsx', assessmentsList, 'utf8');
fs.writeFileSync('client/src/features/trainer/AssessmentDetail.tsx', assessmentDetail, 'utf8');
fs.writeFileSync('client/src/features/trainer/TrainerAnalytics.tsx', trainerAnalytics, 'utf8');
fs.writeFileSync('client/src/features/trainer/TrainerInsights.tsx', trainerInsights, 'utf8');
