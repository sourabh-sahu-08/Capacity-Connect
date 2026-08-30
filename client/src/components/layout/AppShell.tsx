import React from 'react';
import { Sidebar } from './Sidebar';

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500/30 font-sans">
      <Sidebar />
      
      <main className="flex-1 w-full pl-28 pr-8 py-10 min-w-0 overflow-auto relative z-10">
        <div className="max-w-[1200px] mx-auto">
          {children}
        </div>
      </main>

      {/* Floating AI Command placeholder */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <button className="bg-white/80  border border-slate-200 hover:border-indigo-500/50 hover:bg-slate-100 transition-all px-6 py-3 rounded-full flex items-center gap-3 text-sm font-medium text-slate-700 shadow-md hover:shadow-lg transition-shadow">
          <span className="text-indigo-600">✦</span> Ask Capacity AI anything...
        </button>
      </div>
    </div>
  );
};
