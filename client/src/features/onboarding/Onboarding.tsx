import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
  'Welcome',
  'Current Role',
  'Target Role',
  'Skill Assessment',
  'Competency Profile',
];

const ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Analyst',
  'Project Manager',
];

export const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [goal, setGoal] = useState('');
  const [currentRole, setCurrentRole] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));

  const handleFinish = () => {
    const userRole = useAuthStore.getState().user?.role;
    if (userRole === 'MANAGER' || userRole === 'TRAINER' || userRole === 'ADMIN') {
      navigate('/manager-dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <h2 className="text-3xl font-bold text-white">What would you like to achieve?</h2>
            <div className="space-y-3">
              {['Improve current professional skills', 'Prepare for a new role', 'Develop leadership skills', 'Explore new domains'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => { setGoal(opt); nextStep(); }}
                  className={`w-full text-left p-4 rounded-lg border ${goal === opt ? 'border-indigo-500 bg-indigo-500/10' : 'border-zinc-800 bg-zinc-900'} hover:border-indigo-500 transition-colors`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        );
      case 1:
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <h2 className="text-3xl font-bold text-white">What is your current role?</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {ROLES.map((role) => (
                <button
                  key={role}
                  onClick={() => { setCurrentRole(role); nextStep(); }}
                  className={`p-4 rounded-lg border ${currentRole === role ? 'border-indigo-500 bg-indigo-500/10' : 'border-zinc-800 bg-zinc-900'} hover:border-indigo-500 transition-colors`}
                >
                  {role}
                </button>
              ))}
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <h2 className="text-3xl font-bold text-white">What is your target role?</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {ROLES.filter(r => r !== currentRole).map((role) => (
                <button
                  key={role}
                  onClick={() => { setTargetRole(role); nextStep(); }}
                  className={`p-4 rounded-lg border ${targetRole === role ? 'border-indigo-500 bg-indigo-500/10' : 'border-zinc-800 bg-zinc-900'} hover:border-indigo-500 transition-colors`}
                >
                  {role}
                </button>
              ))}
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Initial Skill Assessment</h2>
            <div className="p-6 rounded-lg bg-zinc-900 border border-zinc-800">
              <p className="text-sm text-zinc-400 mb-2">Question 1 of 5</p>
              <p className="text-lg mb-6">Which HTTP method is generally used to partially update a resource?</p>
              <div className="space-y-3">
                {['GET', 'POST', 'PATCH', 'DELETE'].map((ans) => (
                  <button
                    key={ans}
                    onClick={() => {
                      setIsGenerating(true);
                      setTimeout(() => { setIsGenerating(false); nextStep(); }, 2000);
                    }}
                    className="w-full text-left p-4 rounded-lg border border-zinc-800 bg-zinc-950 hover:border-indigo-500 transition-colors"
                  >
                    {ans}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6 text-center">
            {isGenerating ? (
              <div className="py-12">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h2 className="text-xl font-bold text-white">Analyzing Your Skills...</h2>
                <div className="mt-6 w-full max-w-md mx-auto h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 2 }} className="h-full bg-indigo-500" />
                </div>
              </div>
            ) : (
              <div className="py-8">
                <h2 className="text-3xl font-bold text-white mb-2">Competency Profile Created</h2>
                <div className="text-6xl font-extrabold text-indigo-400 my-8">72 <span className="text-2xl text-zinc-500">/ 100</span></div>
                <div className="grid grid-cols-2 gap-6 text-left max-w-lg mx-auto">
                  <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800">
                    <h3 className="text-emerald-400 font-medium mb-2">Strong Areas</h3>
                    <ul className="list-disc list-inside text-sm text-zinc-300">
                      <li>React</li>
                      <li>JavaScript</li>
                      <li>UI Development</li>
                    </ul>
                  </div>
                  <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800">
                    <h3 className="text-amber-400 font-medium mb-2">Development Areas</h3>
                    <ul className="list-disc list-inside text-sm text-zinc-300">
                      <li>Backend Architecture</li>
                      <li>Databases</li>
                      <li>Cloud Deployment</li>
                    </ul>
                  </div>
                </div>
                <button
                  onClick={handleFinish}
                  className="mt-10 px-8 py-3 rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
                >
                  View My Learning Path
                </button>
              </div>
            )}
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <div className="w-full bg-zinc-900 border-b border-zinc-800 h-16 flex items-center px-8">
        <h1 className="text-xl font-bold tracking-tighter">CAPACITY <span className="text-indigo-500">CONNECT</span></h1>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <div className="flex items-center justify-between mb-12">
            {steps.map((step, idx) => (
              <div key={step} className="flex flex-col items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${idx <= currentStep ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-500'}`}>
                  {idx + 1}
                </div>
                <span className={`text-xs mt-2 ${idx <= currentStep ? 'text-zinc-300' : 'text-zinc-600'}`}>{step}</span>
              </div>
            ))}
          </div>
          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
              {renderStepContent()}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
