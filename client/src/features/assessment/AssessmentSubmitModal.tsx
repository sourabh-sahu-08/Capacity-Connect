import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe, FileText, Send, CheckCircle2, AlertCircle, Sparkles, Award } from 'lucide-react';
import { assessmentApi } from '../../api/assessment.api';
import type { AssessmentItem, AssessmentSubmissionItem } from '../../api/assessment.api';

const GithubIcon: React.FC<{ size?: number; className?: string }> = ({ size = 14, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

interface AssessmentSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessment: AssessmentItem;
  existingSubmission?: AssessmentSubmissionItem | null;
  onSuccess: (submission: AssessmentSubmissionItem) => void;
}

export const AssessmentSubmitModal: React.FC<AssessmentSubmitModalProps> = ({
  isOpen,
  onClose,
  assessment,
  existingSubmission,
  onSuccess
}) => {
  const [githubUrl, setGithubUrl] = useState(existingSubmission?.githubUrl || '');
  const [demoUrl, setDemoUrl] = useState(existingSubmission?.demoUrl || '');
  const [notes, setNotes] = useState(existingSubmission?.notes || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubUrl.trim() && !demoUrl.trim()) {
      setError('Please provide at least a GitHub repository URL or a Live Demo URL.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await assessmentApi.submit(assessment.id || assessment._id, {
        githubUrl: githubUrl.trim(),
        demoUrl: demoUrl.trim(),
        notes: notes.trim()
      });
      setSuccessMessage(res.message || 'Submission successfully uploaded for trainer review!');
      onSuccess(res.submission);
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to submit assessment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isGraded = existingSubmission?.status === 'GRADED';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-xl w-full overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 p-6 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-purple-200 text-xs font-semibold tracking-wider uppercase mb-1">
              <Sparkles className="w-4 h-4" /> Project Submission Workspace
            </div>
            <h2 className="text-xl font-bold">{assessment.title}</h2>
            <p className="text-purple-100 text-xs mt-1">
              Max Score: <span className="font-semibold">{assessment.maxScore || 100} pts</span> • Type: {assessment.type || 'Project'}
            </p>
          </div>

          {/* Graded Notice if already graded */}
          {isGraded && (
            <div className="bg-emerald-50 border-b border-emerald-100 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Already Graded</p>
                  <p className="text-sm font-bold text-emerald-900">
                    Score: {existingSubmission.score} / {assessment.maxScore || 100}
                  </p>
                </div>
              </div>
              {existingSubmission.feedback && (
                <p className="text-xs text-emerald-800 italic max-w-xs text-right">
                  "{existingSubmission.feedback}"
                </p>
              )}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* GitHub URL */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <GithubIcon size={14} className="text-slate-900" />
                GitHub Repository URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  placeholder="https://github.com/username/project-repo"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Live Demo URL */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-indigo-600" />
                Live Demo / Deployment URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://my-awesome-demo.vercel.app"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Architecture Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-600" />
                Architecture Notes & Implementation Details
              </label>
              <textarea
                rows={4}
                placeholder="Describe your design choices, key components, setup instructions, or any technical trade-offs..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all placeholder:text-slate-400 resize-none"
              />
            </div>

            {/* Automated Competency notice */}
            <div className="bg-purple-50/70 border border-purple-100 rounded-xl p-3 flex items-start gap-2.5 text-xs text-purple-900">
              <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-purple-950">Automated Competency DNA Lift:</span> Upon trainer evaluation and approval, verified skills will automatically synchronize to your Competency Radar and Role Readiness Score.
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-500/20 hover:shadow-purple-500/30 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    {existingSubmission ? 'Update Submission' : 'Submit Project'}
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
