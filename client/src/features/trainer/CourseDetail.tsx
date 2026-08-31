// @ts-nocheck
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Settings } from 'lucide-react';

export const CourseDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className="space-y-6 pb-32">
      <Link to="/trainer/courses" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" /> Back to Courses
      </Link>
      
      <header className="border-b border-slate-200 pb-6 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold tracking-widest uppercase rounded">Active</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Advanced React Patterns {id}</h1>
        </div>
        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg border border-slate-200 bg-white shadow-sm">
          <Settings className="w-5 h-5" />
        </button>
      </header>

      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto">
        {['Overview', 'Content', 'Learners', 'Assignments', 'Analytics', 'Settings'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === tab ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-8 min-h-[400px] flex items-center justify-center text-slate-500">
        <div className="text-center">
          <p className="font-medium text-slate-900">{activeTab} Management</p>
          <p className="text-sm mt-1">Configure {activeTab.toLowerCase()} for this course.</p>
        </div>
      </div>
    </div>
  );
};
