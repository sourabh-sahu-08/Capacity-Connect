// @ts-nocheck
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, User, Activity, BookOpen, AlertTriangle } from 'lucide-react';

export const LearnerDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className="space-y-6 pb-32">
      <Link to="/trainer/learners" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" /> Back to Learners
      </Link>
      
      <header className="border-b border-slate-200 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">Learner {id} Profile</h1>
          <p className="text-sm text-slate-500">Frontend Architecture � Joined Jan 2026</p>
        </div>
        <button className="px-4 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-sm font-bold tracking-widest uppercase border border-purple-200">
          Message Learner
        </button>
      </header>

      <div className="flex gap-2 border-b border-slate-200">
        {['Overview', 'Learning Progress', 'Assessments', 'Skills', 'Activity Timeline'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-8 min-h-[400px] flex items-center justify-center text-slate-500">
        <div className="text-center">
          <p className="font-medium text-slate-900">{activeTab} Content</p>
          <p className="text-sm mt-1">Detailed view for this section goes here.</p>
        </div>
      </div>
    </div>
  );
};
