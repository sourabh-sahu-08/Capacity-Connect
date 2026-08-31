// @ts-nocheck
import { Link } from 'react-router-dom';
import { Search, Filter, Download } from 'lucide-react';

export const LearnersList = () => {
  return (
    <div className="space-y-6 pb-32">
      <header className="border-b border-slate-200 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">Learners</h1>
        <p className="text-sm text-slate-500">Manage and monitor all learners across your active courses.</p>
      </header>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input type="text" placeholder="Search learners..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500" />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 p-1 flex gap-1">
          {['All Learners', 'At Risk', 'Top Performers', 'Most Improved'].map(tab => (
            <button key={tab} className={`px-4 py-2 text-sm font-medium rounded-lg ${tab === 'All Learners' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}>
              {tab}
            </button>
          ))}
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold tracking-widest text-slate-500 uppercase">Learner</th>
              <th className="px-6 py-4 text-xs font-bold tracking-widest text-slate-500 uppercase">Course</th>
              <th className="px-6 py-4 text-xs font-bold tracking-widest text-slate-500 uppercase">Progress</th>
              <th className="px-6 py-4 text-xs font-bold tracking-widest text-slate-500 uppercase">Risk Level</th>
              <th className="px-6 py-4 text-xs font-bold tracking-widest text-slate-500 uppercase text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[1, 2, 3].map(i => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">Learner Name {i}</td>
                <td className="px-6 py-4 text-slate-500">Frontend Architecture</td>
                <td className="px-6 py-4 text-slate-500">65%</td>
                <td className="px-6 py-4"><span className="px-2 py-1 text-xs font-bold uppercase rounded bg-emerald-50 text-emerald-700">Low Risk</span></td>
                <td className="px-6 py-4 text-right">
                  <Link to={`/trainer/learners/${i}`} className="text-sm font-medium text-purple-600 hover:text-purple-700">View Profile</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
