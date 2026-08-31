import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const QUESTIONS = [
  { id: 1, text: 'Which of the following is true about React useEffect dependencies?', options: ['It must always be empty', 'It tells React when to re-run the effect', 'It is not recommended to use', 'It automatically infers dependencies'], answer: 1 },
  { id: 2, text: 'How do you optimize rendering of a list in React?', options: ['Using index as key', 'Using unique stable keys', 'Removing keys', 'Using random numbers as keys'], answer: 1 },
  { id: 3, text: 'What does the useMemo hook do?', options: ['Memoizes a function', 'Memoizes a value to prevent expensive recalculations', 'Fetches data', 'Mutates state directly'], answer: 1 },
];

export const Assessment = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const navigate = useNavigate();

  useEffect(() => {
    if (showResult) return;
    const timer = setInterval(() => setTimeLeft(prev => prev > 0 ? prev - 1 : 0), 1000);
    return () => clearInterval(timer);
  }, [showResult]);

  const handleNext = () => {
    if (selected === QUESTIONS[currentIndex].answer) {
      setScore(s => s + 1);
    }
    
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelected(null);
    } else {
      setShowResult(true);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (showResult) {
    const percentage = Math.round((score / QUESTIONS.length) * 100);
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-slate-900 max-w-3xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Assessment Complete</h1>
        
        <div className="bg-white border border-slate-200 rounded-xl p-10 w-full text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-purple-500 to-purple-500"></div>
          <div className="text-sm font-medium text-slate-600 mb-2 uppercase tracking-widest">Overall Score</div>
          <div className="text-6xl font-extrabold text-purple-600 mb-6">{percentage}%</div>
          <div className="flex justify-center gap-12 text-sm">
            <div>
              <div className="text-slate-600 mb-1">Correct Answers</div>
              <div className="text-xl font-bold">{score} / {QUESTIONS.length}</div>
            </div>
            <div>
              <div className="text-slate-600 mb-1">Time Taken</div>
              <div className="text-xl font-bold">{formatTime(600 - timeLeft)}</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-8 w-full">
          <h3 className="text-lg font-bold mb-4">Competency Impact</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">React.js</span>
              <span className="text-emerald-600 font-bold flex items-center gap-1">72% → {percentage >= 60 ? '78% ↑' : '72% -'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Problem Solving</span>
              <span className="text-emerald-600 font-bold flex items-center gap-1">80% → {percentage >= 60 ? '84% ↑' : '80% -'}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4 w-full">
          <button onClick={() => navigate('/dashboard')} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium transition-colors">
            Back to Dashboard
          </button>
          <button onClick={() => navigate('/learning-hub')} className="flex-1 py-3 bg-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.5)] hover:bg-purple-700 rounded-xl font-medium transition-colors">
            Continue Learning
          </button>
        </div>
      </div>
    );
  }

  const q = QUESTIONS[currentIndex];

  return (
    <div className="p-8 text-slate-900 max-w-3xl mx-auto h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Advanced React Assessment</h1>
        <div className="font-mono text-xl bg-white px-4 py-2 rounded-lg border border-slate-200">
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="mb-6 flex justify-between text-sm text-slate-600 font-medium">
        <span>Question {currentIndex + 1} of {QUESTIONS.length}</span>
        <span>{Math.round((currentIndex / QUESTIONS.length) * 100)}% Completed</span>
      </div>
      <div className="w-full bg-slate-100 h-2 rounded-full mb-10 overflow-hidden">
        <div className="bg-purple-500 h-full transition-all duration-300" style={{ width: `${(currentIndex / QUESTIONS.length) * 100}%` }}></div>
      </div>

      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <h2 className="text-2xl font-medium leading-relaxed">{q.text}</h2>
            <div className="space-y-3">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                    selected === i 
                      ? 'border-purple-500 bg-purple-50 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                      : 'border-slate-200 bg-white hover:border-zinc-600'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${selected === i ? 'border-purple-500' : 'border-zinc-600'}`}>
                      {selected === i && <div className="w-3 h-3 rounded-full bg-purple-500"></div>}
                    </div>
                    <span className="text-lg">{opt}</span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="pt-8 border-t border-slate-200 flex justify-end">
        <button
          onClick={handleNext}
          disabled={selected === null}
          className="px-8 py-3 bg-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.5)] hover:bg-purple-700 disabled:bg-slate-100 disabled:text-slate-500 rounded-xl font-bold transition-colors"
        >
          {currentIndex === QUESTIONS.length - 1 ? 'Submit Assessment' : 'Next Question'}
        </button>
      </div>
    </div>
  );
};
