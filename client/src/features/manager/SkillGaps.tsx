// @ts-nocheck
import React from 'react';
import { Crosshair, AlertTriangle, ArrowRight } from 'lucide-react';

export const SkillGaps = () => {
  const gaps = [
    { id: 1, skill: 'Cloud Infrastructure', affected: 46, importance: 'Critical', severity: 'HIGH' },
    { id: 2, skill: 'System Design', affected: 38, importance: 'High', severity: 'HIGH' },
    { id: 3, skill: 'Data Analytics', affected: 29, importance: 'Medium', severity: 'MEDIUM' }
  ];

  return (
    <div className="space-y-6 pb-32">
      <header className="border-b border-slate-200 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">Strategic Skill Gaps</h1>
        <p className="text-sm text-slate-500">Identify and address critical capability gaps across the workforce.</p>
      </header>

      <div className="grid gap-4">
        {gaps.map(gap => (
          <div key={gap.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center justify-between hover:border-purple-300 transition-colors cursor-pointer group">
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${gap.severity === 'HIGH' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg mb-1">{gap.skill}</h3>
                <div className="flex gap-3 text-xs font-medium text-slate-500">
                  <span className="bg-slate-100 px-2 py-1 rounded">{gap.affected} Employees Affected</span>
                  <span className="bg-slate-100 px-2 py-1 rounded">Business Impact: {gap.importance}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded ${gap.severity === 'HIGH' ? 'text-rose-700 bg-rose-50' : 'text-amber-700 bg-amber-50'}`}>
                {gap.severity} SEVERITY
              </span>
              <ArrowRight className="text-slate-400 group-hover:text-purple-600 transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
