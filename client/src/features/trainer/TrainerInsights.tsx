// @ts-nocheck
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
