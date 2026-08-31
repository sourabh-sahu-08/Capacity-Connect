import React from 'react';
import { Map, Users } from 'lucide-react';

export const ReadinessPlanning = () => {
  return (
    <div className="space-y-6 pb-32">
      <header className="border-b border-slate-200 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">Readiness Planning</h1>
        <p className="text-sm text-slate-500">Compare current workforce capability against target organizational requirements.</p>
      </header>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-slate-900 text-lg mb-6">Role Readiness Matrix</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { role: 'Cloud Engineer', current: 54, target: 80, gap: 26, affected: 42 },
            { role: 'Data Analyst', current: 69, target: 75, gap: 6, affected: 18 },
            { role: 'Frontend Dev', current: 78, target: 80, gap: 2, affected: 35 }
          ].map((r, i) => (
            <div key={i} className="border border-slate-100 bg-slate-50 rounded-lg p-5">
              <h4 className="font-bold text-slate-900 mb-4">{r.role}</h4>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Current</span>
                  <span className="font-medium text-slate-900">{r.current}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5"><div className="bg-purple-600 h-1.5 rounded-full" style={{ width: `${r.current}%` }}></div></div>
                
                <div className="flex justify-between text-sm pt-2">
                  <span className="text-slate-500">Target</span>
                  <span className="font-medium text-slate-900">{r.target}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5"><div className="bg-slate-400 h-1.5 rounded-full" style={{ width: `${r.target}%` }}></div></div>
              </div>
              <div className="flex items-center justify-between text-xs font-bold tracking-widest uppercase">
                <span className="text-rose-600 bg-rose-50 px-2 py-1 rounded">Gap: {r.gap}%</span>
                <span className="text-slate-500"><Users size={12} className="inline mr-1" /> {r.affected}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
