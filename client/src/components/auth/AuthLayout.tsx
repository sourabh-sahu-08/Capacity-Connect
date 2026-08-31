import React from 'react';
import { AuthBrandPanel } from './AuthBrandPanel';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-white flex text-slate-900 font-sans selection:bg-purple-500/30">
      <AuthBrandPanel />
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-10 text-center">
            <h1 className="text-2xl font-bold tracking-tighter text-slate-900">
              CAPACITY <span className="text-purple-600">CONNECT</span>
            </h1>
          </div>
          
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{title}</h2>
            {subtitle && <p className="mt-2 text-slate-600">{subtitle}</p>}
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
};
