// @ts-nocheck
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Quote, Send, Sparkles, UserCheck, ShieldCheck, AlertCircle } from 'lucide-react';
import { userApi } from '../../api/user.api';
import type { Recommendation } from '../../api/user.api';

interface RecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUserId: string;
  targetUserName: string;
  onSuccess: (recommendation: Recommendation) => void;
}

const RELATIONSHIP_OPTIONS = [
  'Collaborated together as peer engineers',
  'Trained / Mentored this person',
  'Managed / Led this person directly',
  'Reported to / Worked under this person',
  'Partnered on a high-impact project',
  'Senior Colleague & Technical Advisor',
];

export const RecommendationModal: React.FC<RecommendationModalProps> = ({
  isOpen,
  onClose,
  targetUserId,
  targetUserName,
  onSuccess,
}) => {
  const [relationship, setRelationship] = useState(RELATIONSHIP_OPTIONS[0]);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim().length < 15) {
      setError('Please provide a recommendation of at least 15 characters.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await userApi.createRecommendation(targetUserId, {
        relationship,
        content: content.trim(),
      });
      onSuccess(res.data.recommendation);
      setContent('');
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit recommendation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-2xl z-10 text-slate-800"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 shadow-xs">
                <Quote size={20} className="fill-purple-100" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-extrabold text-slate-900">
                  Write a Recommendation
                </h3>
                <p className="text-xs text-slate-500">
                  Vouch for <span className="font-bold text-slate-700">{targetUserName}</span>'s capabilities and collaboration.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {error && (
            <div className="mt-4 rounded-xl bg-rose-50 border border-rose-200 p-3.5 text-xs font-semibold text-rose-700 flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-5">
            {/* Relationship Select */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Your Professional Relationship *
              </label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-purple-500 focus:bg-white transition-all font-medium"
              >
                {RELATIONSHIP_OPTIONS.map((opt, i) => (
                  <option key={i} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Testimonial Content */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Recommendation & Testimonial *
                </label>
                <span className="text-[11px] text-slate-400 font-medium">
                  {content.length} characters
                </span>
              </div>
              <textarea
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`What made working or learning with ${targetUserName} standout? Mention specific technical strengths, delivery, problem solving, or leadership...`}
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-purple-500 focus:bg-white resize-none transition-all leading-relaxed"
              />
            </div>

            {/* Privacy Note */}
            <div className="flex items-start gap-2.5 rounded-2xl bg-purple-50/60 border border-purple-100 p-3.5 text-xs text-purple-900">
              <ShieldCheck size={18} className="text-purple-600 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed text-purple-800">
                <strong className="font-bold">Peer Review Workflow:</strong> Your recommendation will be sent to {targetUserName} for review. Once approved, it will be proudly featured on their public profile with your verified credentials.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || content.trim().length < 15}
                className="flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-purple-600/20 hover:bg-purple-700 transition-all disabled:opacity-50"
              >
                <Send size={14} />
                {submitting ? 'Submitting...' : 'Send Recommendation'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
