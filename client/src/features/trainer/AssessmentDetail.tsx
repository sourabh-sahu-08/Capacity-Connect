import React, { useState } from 'react';
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
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
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
