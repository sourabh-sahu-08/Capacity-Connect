// @ts-nocheck
import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';

export const ManagerAnalytics = () => {
  const [range, setRange] = useState('30D');
  
  return (
    <div className="space-y-6 pb-32">
      <header className="border-b border-slate-200 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">Workforce Analytics</h1>
          <p className="text-sm text-slate-500">Track capability growth and learning engagement over time.</p>
        </div>
        <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
          {['7D', '30D', '90D', '6M', '1Y'].map(r => (
            <button key={r} onClick={() => setRange(r)} className={`px-3 py-1 rounded text-xs font-bold tracking-widest uppercase ${range === r ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>
              {r}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm min-h-[400px] flex flex-col lg:col-span-2">
          <h3 className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-6">Competency Growth Trend</h3>
          <div className="flex-1 border-2 border-dashed border-slate-100 rounded-lg flex items-center justify-center text-slate-400">
            [ Growth Chart ]
          </div>
        </div>
      </div>
    </div>
  );
};
