import React from 'react';
import { Sidebar } from './Sidebar';

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-zinc-950">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-auto relative">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
