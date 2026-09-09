import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  FileCode,
  Globe,
  Sparkles,
  Award,
  Send,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { assessmentApi } from '../../api/assessment.api';
import type { AssessmentItem, AssessmentSubmissionItem } from '../../api/assessment.api';
import { AssessmentSubmitModal } from './AssessmentSubmitModal';

const GithubIcon: React.FC<{ size?: number; className?: string }> = ({ size = 14, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const DEFAULT_QUESTIONS = [
  { id: 1, text: 'Which of the following is true about React useEffect dependencies?', options: ['It must always be empty', 'It tells React when to re-run the effect', 'It is not recommended to use', 'It automatically infers dependencies'], answer: 1 },
  { id: 2, text: 'How do you optimize rendering of a list in React?', options: ['Using index as key', 'Using unique stable keys', 'Removing keys', 'Using random numbers as keys'], answer: 1 },
  { id: 3, text: 'What does the useMemo hook do?', options: ['Memoizes a function', 'Memoizes a value to prevent expensive recalculations', 'Fetches data', 'Mutates state directly'], answer: 1 },
];

export const Assessment = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Project Assessment State (when id is present)
  const [assessment, setAssessment] = useState<AssessmentItem | null>(null);
  const [submission, setSubmission] = useState<AssessmentSubmissionItem | null>(null);
  const [loadingAssessment, setLoadingAssessment] = useState<boolean>(!!id);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Quiz State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  useEffect(() => {
    if (id) {
      loadAssessment();
    }
  }, [id]);

  const loadAssessment = async () => {
    if (!id) return;
    setLoadingAssessment(true);
    try {
      const data = await assessmentApi.getById(id);
      setAssessment(data);
      if (data.mySubmission) {
        setSubmission(data.mySubmission);
      }
    } catch (err) {
      console.error('Error loading assessment:', err);
    } finally {
      setLoadingAssessment(false);
    }
  };

  useEffect(() => {
    if (showResult || assessment) return;
    const timer = setInterval(() => setTimeLeft(prev => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, [showResult, assessment]);

  const handleNextQuestion = () => {
    if (selected === DEFAULT_QUESTIONS[currentIndex].answer) {
      setScore(s => s + 1);
    }
    
    if (currentIndex < DEFAULT_QUESTIONS.length - 1) {
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

  // If loading project assessment
  if (loadingAssessment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-500">Loading assessment details...</p>
      </div>
    );
  }

  // If viewing a specific project assessment
  if (assessment) {
    const targetCompetencies = assessment.course?.targetCompetencies || ['Full-Stack Engineering'];
    const isGraded = submission?.status === 'GRADED';
    const isRejected = submission?.status === 'REJECTED';

    return (
      <div className="max-w-5xl mx-auto p-6 md:p-8 space-y-8 pb-32">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link
            to="/learning-hub"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Learning Hub
          </Link>
          {assessment.course && (
            <Link
              to={`/course/${assessment.course.id}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-700 bg-purple-50 px-3 py-1.5 rounded-xl transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" /> View Course Material
            </Link>
          )}
        </div>

        {/* Header Hero */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white rounded-3xl p-8 md:p-10 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-purple-200">
                {assessment.course?.title || 'Course Project'}
              </span>
              <span className="px-3 py-1 bg-purple-500/30 rounded-full text-xs font-bold uppercase tracking-wider text-purple-300">
                {assessment.type || 'Practical Assignment'}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{assessment.title}</h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Complete the deliverables described below and submit your repository URL and live demo for trainer evaluation.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-purple-200 font-semibold pt-2">
              <span>Max Score: <strong className="text-white">{assessment.maxScore || 100} pts</strong></span>
              <span>•</span>
              <span>Trainer: <strong className="text-white">{assessment.trainer?.name || 'Assigned Instructor'}</strong></span>
            </div>
          </div>
          <div className="absolute right-0 top-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Current Submission Status Card */}
        {submission && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`border rounded-3xl p-6 md:p-8 shadow-sm ${
              isGraded
                ? 'bg-emerald-50/40 border-emerald-200'
                : isRejected
                ? 'bg-rose-50/40 border-rose-200'
                : 'bg-amber-50/40 border-amber-200'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/60">
              <div className="flex items-center gap-3.5">
                <div
                  className={`p-3 rounded-2xl ${
                    isGraded
                      ? 'bg-emerald-100 text-emerald-700'
                      : isRejected
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {isGraded ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      {isGraded ? 'Assessment Graded & Verified' : isRejected ? 'Revisions Requested' : 'Submission Under Review'}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isGraded
                          ? 'bg-emerald-100 text-emerald-800'
                          : isRejected
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {submission.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Submitted on {new Date(submission.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {isGraded && (
                <div className="bg-white px-5 py-3 rounded-2xl border border-emerald-200 shadow-sm text-right">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Awarded Score</p>
                  <p className="text-2xl font-extrabold text-emerald-600">
                    {submission.score} <span className="text-sm font-semibold text-slate-400">/ {assessment.maxScore || 100}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Links & Notes */}
            <div className="pt-6 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                {submission.githubUrl && (
                  <a
                    href={submission.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 hover:border-purple-400 shadow-xs transition-colors"
                  >
                    <GithubIcon size={14} className="text-slate-900" /> View Submitted Code <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                )}
                {submission.demoUrl && (
                  <a
                    href={submission.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 border border-indigo-200 rounded-xl text-xs font-bold text-indigo-700 hover:bg-indigo-100 shadow-xs transition-colors"
                  >
                    <Globe className="w-4 h-4 text-indigo-600" /> Open Live Deployment <ExternalLink className="w-3 h-3 text-indigo-400" />
                  </a>
                )}
              </div>

              {submission.notes && (
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 text-xs text-slate-700 space-y-1">
                  <p className="font-bold text-slate-500 uppercase text-[10px]">Your Notes:</p>
                  <p className="whitespace-pre-wrap">{submission.notes}</p>
                </div>
              )}

              {/* Trainer Feedback */}
              {submission.feedback && (
                <div className="bg-purple-50/80 border border-purple-200 p-4 rounded-2xl space-y-1.5">
                  <div className="flex items-center gap-1.5 text-purple-900 font-bold text-xs">
                    <Award className="w-4 h-4 text-purple-600" />
                    Trainer Feedback ({submission.gradedBy?.name || 'Instructor'}):
                  </div>
                  <p className="text-xs text-purple-950 italic leading-relaxed">
                    "{submission.feedback}"
                  </p>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setIsSubmitModalOpen(true)}
                  className="px-4 py-2 bg-white border border-slate-200 hover:border-purple-300 text-slate-700 hover:text-purple-700 text-xs font-bold rounded-xl transition-all shadow-xs"
                >
                  {isGraded ? 'Submit Revision / Update' : 'Edit Submission Links'}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* If Not Submitted Yet */}
        {!submission && (
          <div className="bg-white border border-purple-200 rounded-3xl p-8 shadow-md text-center space-y-4">
            <div className="w-14 h-14 mx-auto bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center">
              <FileCode className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Ready to submit your project?</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Provide your GitHub repository and live deployment link. Our trainers will evaluate your implementation against the rubric criteria.
            </p>
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all"
            >
              <Send className="w-4 h-4" /> Open Submission Workspace
            </button>
          </div>
        )}

        {/* Competency DNA Matrix Preview */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3 className="text-base font-bold text-slate-900">Competencies Evaluated in this Assessment</h3>
          </div>
          <p className="text-xs text-slate-500">
            Passing this project automatically deposits verified competency evidence into your profile:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
            {targetCompetencies.map(comp => (
              <div key={comp} className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-bold text-slate-800">{comp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Submission Modal */}
        <AssessmentSubmitModal
          isOpen={isSubmitModalOpen}
          onClose={() => setIsSubmitModalOpen(false)}
          assessment={assessment}
          existingSubmission={submission}
          onSuccess={(newSub) => setSubmission(newSub)}
        />
      </div>
    );
  }

  // Quiz Fallback / Onboarding mode
  if (showResult) {
    const percentage = Math.round((score / DEFAULT_QUESTIONS.length) * 100);
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-slate-900 max-w-3xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Assessment Complete</h1>
        
        <div className="bg-white border border-slate-200 rounded-xl p-10 w-full text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
          <div className="text-sm font-medium text-slate-600 mb-2 uppercase tracking-widest">Overall Score</div>
          <div className="text-6xl font-extrabold text-purple-600 mb-6">{percentage}%</div>
          <div className="flex justify-center gap-12 text-sm">
            <div>
              <div className="text-slate-600 mb-1">Correct Answers</div>
              <div className="text-xl font-bold">{score} / {DEFAULT_QUESTIONS.length}</div>
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
          <button onClick={() => navigate('/learning-hub')} className="flex-1 py-3 bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)] hover:bg-purple-700 rounded-xl font-medium transition-colors">
            Continue Learning
          </button>
        </div>
      </div>
    );
  }

  const q = DEFAULT_QUESTIONS[currentIndex];

  return (
    <div className="p-8 text-slate-900 max-w-3xl mx-auto h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Interactive Competency Assessment</h1>
        <div className="font-mono text-xl bg-white px-4 py-2 rounded-lg border border-slate-200">
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="mb-6 flex justify-between text-sm text-slate-600 font-medium">
        <span>Question {currentIndex + 1} of {DEFAULT_QUESTIONS.length}</span>
        <span>{Math.round((currentIndex / DEFAULT_QUESTIONS.length) * 100)}% Completed</span>
      </div>
      <div className="w-full bg-slate-100 h-2 rounded-full mb-10 overflow-hidden">
        <div className="bg-purple-500 h-full transition-all duration-300" style={{ width: `${(currentIndex / DEFAULT_QUESTIONS.length) * 100}%` }}></div>
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
                      : 'border-slate-200 bg-white hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${selected === i ? 'border-purple-500' : 'border-slate-400'}`}>
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
          onClick={handleNextQuestion}
          disabled={selected === null}
          className="px-8 py-3 bg-purple-600 text-white shadow-md hover:bg-purple-700 disabled:bg-slate-100 disabled:text-slate-500 rounded-xl font-bold transition-colors"
        >
          {currentIndex === DEFAULT_QUESTIONS.length - 1 ? 'Submit Assessment' : 'Next Question'}
        </button>
      </div>
    </div>
  );
};
