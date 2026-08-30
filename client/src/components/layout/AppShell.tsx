import React from 'react';
import { Sidebar } from './Sidebar';

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30 font-sans">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,#1a1b26_0%,transparent_40%)] pointer-events-none opacity-50"></div>
      
      <Sidebar />
      
      <main className="flex-1 w-full pl-28 pr-8 py-10 min-w-0 overflow-auto relative z-10">
        <div className="max-w-[1200px] mx-auto">
          {children}
        </div>
      </main>

      {/* Floating AI Command placeholder */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <button className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 hover:border-indigo-500/50 hover:bg-zinc-800 transition-all px-6 py-3 rounded-full flex items-center gap-3 text-sm font-medium text-zinc-300 shadow-2xl">
          <span className="text-indigo-400">✦</span> Ask Capacity AI anything...
        </button>
      </div>
    </div>
  );
};
