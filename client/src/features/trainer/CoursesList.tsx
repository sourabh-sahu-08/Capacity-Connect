// @ts-nocheck
import { Link } from 'react-router-dom';
import { Plus, Search, Filter } from 'lucide-react';

export const CoursesList = () => {
  return (
    <div className="space-y-6 pb-32">
      <header className="border-b border-slate-200 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">My Training Programs</h1>
          <p className="text-sm text-slate-500">Manage your active courses, drafts, and past programs.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-lg text-sm font-bold tracking-widest uppercase shadow-sm">
          <Plus className="w-4 h-4" /> Create Course
        </button>
      </header>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input type="text" placeholder="Search courses..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500" />
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        {['Active', 'Drafts', 'Completed', 'Archived'].map(tab => (
          <button key={tab} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === 'Active' ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <Link key={i} to={`/trainer/courses/${i}`} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:border-purple-300 hover:shadow-md transition-all group">
            <h3 className="font-bold text-slate-900 text-lg mb-2">Advanced React Patterns {i}</h3>
            <p className="text-sm text-slate-500 line-clamp-2 mb-6">Master advanced component design, hooks architecture, and state management.</p>
            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
              <div>
                <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Learners</p>
                <p className="font-medium text-slate-900">42</p>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Completion</p>
                <p className="font-medium text-slate-900">78%</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
