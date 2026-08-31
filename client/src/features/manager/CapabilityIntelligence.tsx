import React from 'react';
import { Hexagon } from 'lucide-react';

export const CapabilityIntelligence = () => {
  return (
    <div className="space-y-6 pb-32">
      <header className="border-b border-slate-200 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">Capability Intelligence</h1>
        <p className="text-sm text-slate-500">Organization-wide competency maps and capability distribution.</p>
      </header>

      <div className="bg-white border border-slate-200 rounded-xl p-8 min-h-[500px] flex flex-col items-center justify-center text-slate-400">
        <Hexagon size={48} className="mb-4 text-purple-200" />
        <p className="font-medium text-slate-900">Capability Heatmap</p>
        <p className="text-sm">Interactive visualization loading...</p>
      </div>
    </div>
  );
};
