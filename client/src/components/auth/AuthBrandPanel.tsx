import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Users } from 'lucide-react';

export const AuthBrandPanel = () => {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-slate-50 relative overflow-hidden flex-col justify-center items-center p-12">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-40 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-lg">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-12">
            <h1 className="text-4xl font-bold tracking-tighter text-slate-900 mb-4">
              CAPACITY <span className="text-purple-600">CONNECT</span>
            </h1>
            <h2 className="text-2xl font-semibold text-slate-700">
              Build stronger capabilities.<br/>Create smarter teams.
            </h2>
          </div>

          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 text-purple-600">
                <Sparkles size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">AI-Powered Skill Intelligence</h3>
                <p className="text-slate-500 mt-1">Discover hidden skill gaps and get personalized recommendations.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 text-purple-600">
                <TrendingUp size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Personalized Growth</h3>
                <p className="text-slate-500 mt-1">Adaptive learning paths that evolve with your career goals.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 text-purple-600">
                <Users size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Workforce Capability Insights</h3>
                <p className="text-slate-500 mt-1">Make strategic decisions with real-time organizational readiness metrics.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
