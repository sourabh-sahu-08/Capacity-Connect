// @ts-nocheck
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const steps = ['Expertise', 'Experience', 'Methods', 'Objectives'];

export const TrainerOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  // Answers
  const [expertise, setExpertise] = useState('');
  const [subjects, setSubjects] = useState<string[]>([]);
  const [experience, setExperience] = useState('');
  const [type, setType] = useState('');
  const [learners, setLearners] = useState('');
  const [methods, setMethods] = useState<string[]>([]);
  const [objective, setObjective] = useState('');

  const nextStep = () => setCurrentStep(prev => prev + 1);
  
  const handleFinish = async () => {
    const token = useAuthStore.getState().token;
    
    try {
      const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.post(
        `${apiURL}/api/onboarding/complete-trainer`,
        {
          expertiseAreas: selectedExpertise,
          availability: availability
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // Update local state so it doesn't redirect again
      const setAuth = useAuthStore.getState().setAuth;
      const user = useAuthStore.getState().user;
      if (user) {
        setAuth({ ...user, trainerOnboardingCompleted: true }, token as string);
      }
      
    } catch (err) {
      console.error('Failed to complete trainer onboarding', err);
    }
    
    navigate('/trainer/dashboard');
  };

  const toggleSelection = (arr: string[], setArr: any, item: string) => {
    if (arr.includes(item)) {
      setArr(arr.filter(i => i !== item));
    } else {
      setArr([...arr, item]);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-900">What is your primary area of expertise?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {['Software Development', 'Data Science', 'Cloud Computing', 'Cybersecurity', 'UI/UX Design', 'Business & Management', 'Communication Skills', 'Other'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => { setExpertise(opt); nextStep(); }}
                  className={`w-full text-left p-4 rounded-lg border ${expertise === opt ? 'border-purple-500 bg-purple-50' : 'border-slate-200 bg-white'} hover:border-purple-500 transition-colors`}
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
            <h2 className="text-2xl font-bold text-slate-900">What subjects or skills do you train? (Select multiple)</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {['React', 'Node.js', 'Python', 'Machine Learning', 'Cloud Computing', 'Leadership', 'Communication'].map((sub) => (
                <button
                  key={sub}
                  onClick={() => toggleSelection(subjects, setSubjects, sub)}
                  className={`p-3 text-sm rounded-lg border ${subjects.includes(sub) ? 'border-purple-500 bg-purple-50' : 'border-slate-200 bg-white'} hover:border-purple-500 transition-colors`}
                >
                  {sub}
                </button>
              ))}
            </div>
            
            <h2 className="text-2xl font-bold text-slate-900 mt-8 pt-4 border-t border-slate-100">Training experience level?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {['Beginner Trainer', '1�3 Years', '3�5 Years', '5+ Years'].map((exp) => (
                <button
                  key={exp}
                  onClick={() => { setExperience(exp); nextStep(); }}
                  className={`p-4 rounded-lg border ${experience === exp ? 'border-purple-500 bg-purple-50' : 'border-slate-200 bg-white'} hover:border-purple-500 transition-colors`}
                >
                  {exp}
                </button>
              ))}
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">What type of training do you primarily conduct?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {['Technical Training', 'Practical Workshops', 'Corporate Training', 'Academic Training', 'Mentorship'].map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`p-4 rounded-lg border ${type === t ? 'border-purple-500 bg-purple-50' : 'border-slate-200 bg-white'} hover:border-purple-500 transition-colors`}
                >
                  {t}
                </button>
              ))}
            </div>
            
            <h2 className="text-2xl font-bold text-slate-900 mt-8 pt-4 border-t border-slate-100">How many learners do you typically manage?</h2>
            <div className="grid grid-cols-2 gap-3">
              {['1�20', '20�50', '50�100', '100+'].map((num) => (
                <button
                  key={num}
                  onClick={() => { setLearners(num); nextStep(); }}
                  className={`p-4 rounded-lg border ${learners === num ? 'border-purple-500 bg-purple-50' : 'border-slate-200 bg-white'} hover:border-purple-500 transition-colors`}
                >
                  {num}
                </button>
              ))}
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">What are your preferred training methods? (Select multiple)</h2>
            <div className="grid grid-cols-2 gap-3">
              {['Live Sessions', 'Recorded Content', 'Practical Projects', 'Assessments', 'Workshops', 'One-to-One Mentoring'].map((m) => (
                <button
                  key={m}
                  onClick={() => toggleSelection(methods, setMethods, m)}
                  className={`p-3 text-sm rounded-lg border ${methods.includes(m) ? 'border-purple-500 bg-purple-50' : 'border-slate-200 bg-white'} hover:border-purple-500 transition-colors`}
                >
                  {m}
                </button>
              ))}
            </div>
            
            <h2 className="text-2xl font-bold text-slate-900 mt-8 pt-4 border-t border-slate-100">What is your primary training objective?</h2>
            <div className="space-y-3">
              {['Improve Learner Skills', 'Prepare Learners for Jobs', 'Improve Team Performance', 'Build Technical Competency', 'Leadership Development'].map((obj) => (
                <button
                  key={obj}
                  onClick={() => { setObjective(obj); }}
                  className={`w-full text-left p-4 rounded-lg border ${objective === obj ? 'border-purple-500 bg-purple-50' : 'border-slate-200 bg-white'} hover:border-purple-500 transition-colors`}
                >
                  {obj}
                </button>
              ))}
            </div>
            <div className="pt-6">
              <button
                onClick={handleFinish}
                className="w-full py-4 bg-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.5)] text-white hover:bg-purple-700 rounded-xl font-bold transition-colors shadow-lg"
              >
                Complete Onboarding
              </button>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="w-full bg-white border-b border-slate-200 h-16 flex items-center px-8">
        <h1 className="text-xl font-bold tracking-tighter">CAPACITY <span className="text-purple-500">CONNECT</span></h1>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-6 py-12">
        <div className="w-full max-w-2xl">
          <div className="flex items-center justify-between mb-12">
            {steps.map((step, idx) => (
              <div key={step} className="flex flex-col items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${idx <= currentStep ? 'bg-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.5)] text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {idx + 1}
                </div>
                <span className={`text-xs mt-2 ${idx <= currentStep ? 'text-slate-700' : 'text-slate-500'}`}>{step}</span>
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
