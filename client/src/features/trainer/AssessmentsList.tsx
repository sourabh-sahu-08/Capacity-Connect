// @ts-nocheck
import React from 'react';
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
          <div key={kpi.label} className={`bg-white border ${kpi.alert ? 'border-amber-200' : 'border-slate-200'} rounded-lg p-4 shadow-sm`}>
            <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">{kpi.label}</p>
            <p className={`text-2xl font-medium mt-1 ${kpi.alert ? 'text-amber-600' : 'text-slate-900'}`}>{kpi.value}</p>
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
                  <Link to={`/trainer/assessments/${i}`} className="font-medium text-purple-600 hover:text-purple-700">Module {i} Final Challenge</Link>
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
