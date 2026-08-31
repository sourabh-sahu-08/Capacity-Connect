import React from 'react';
import { TopHeader } from '../components/layout/TopHeader';
import { TrainerSidebar } from './TrainerSidebar';

export const TrainerLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="cc-app flex min-h-screen bg-slate-50 text-slate-900 selection:bg-purple-500/30 font-sans">
      <TrainerSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden pl-20">
        <TopHeader />
        <main className="flex-1 w-full p-8 overflow-auto relative z-10">
        <div className="max-w-[1200px] mx-auto">
          {children}
        </div>
        </main>
      </div>
      <div className="fixed bottom-8 right-8 z-50 group">
        <button className="bg-white border border-slate-200 hover:border-purple-500 hover:bg-purple-50 transition-all w-14 h-14 rounded-full flex items-center justify-center text-purple-600 shadow-md hover:shadow-lg">
          <span className="text-2xl group-hover:scale-110 transition-transform">?</span>
        </button>
        <div className="absolute right-full top-1/2 -translate-y-1/2 mr-4 px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Ask Capacity AI
        </div>
      </div>
    </div>
  );
};
