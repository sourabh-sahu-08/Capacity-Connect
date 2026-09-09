// @ts-nocheck
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Award, 
  Sparkles, 
  ShieldCheck, 
  Share2, 
  Check, 
  Download, 
  ExternalLink,
  CheckCircle2,
  Calendar,
  Building
} from 'lucide-react';
import type { GamificationBadge } from '../../api/gamification.api';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  badge: GamificationBadge | null;
  userName: string;
  userRole?: string;
  organization?: string;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  badge,
  userName,
  userRole,
  organization,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !badge) return null;

  const credentialId = `CC-${badge.id.replace('badge-', '').toUpperCase()}-${Math.abs(
    userName.split('').reduce((acc, c) => acc + c.charCodeAt(0), 1024)
  ).toString(16).toUpperCase()}`;

  const issueDate = badge.unlockedAt
    ? new Date(badge.unlockedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/verify/${credentialId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareLinkedIn = () => {
    const text = encodeURIComponent(
      `Excited to have earned the verified "${badge.title}" achievement certificate on Capacity-Connect! 🚀 #CapacityConnect #Competency #ContinuousLearning`
    );
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${text}`, '_blank');
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
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl z-10 text-slate-800"
        >
          {/* Header Action Bar */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-3.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
              <ShieldCheck size={16} className="text-purple-600" />
              <span>Verified Certificate of Achievement</span>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Certificate Body */}
          <div className="p-6 sm:p-10">
            {/* Outer Decorative Certificate Border */}
            <div className="relative overflow-hidden rounded-2xl border-4 border-double border-amber-600/30 bg-linear-to-b from-amber-50/40 via-white to-purple-50/30 p-8 text-center shadow-inner">
              {/* Background Geometric Watermark */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.06),transparent_60%)] pointer-events-none" />
              <div className="absolute -top-12 -left-12 h-32 w-32 rounded-full bg-amber-400/10 blur-xl pointer-events-none" />
              <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-purple-400/10 blur-xl pointer-events-none" />

              {/* Capacity-Connect Crest / Emblem */}
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-tr from-purple-600 via-indigo-600 to-purple-800 text-white shadow-lg shadow-purple-500/25">
                <Award size={32} />
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-purple-600">
                  Capacity-Connect Certified Competency
                </p>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
                  Certificate of Achievement
                </h2>
                <p className="text-xs text-slate-500 italic">
                  This official credential is proudly awarded to
                </p>
              </div>

              {/* Recipient Name */}
              <div className="my-6 border-b border-amber-600/20 pb-2 inline-block min-w-[280px]">
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-wide">
                  {userName}
                </h3>
                {organization && (
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">
                    {organization} • {userRole || 'Software Engineer'}
                  </p>
                )}
              </div>

              {/* Achievement Description */}
              <div className="max-w-md mx-auto space-y-2 mb-6">
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  For outstanding performance and successfully unlocking the verified credential:
                </p>
                <div className="inline-flex items-center gap-2 rounded-xl bg-purple-100/70 border border-purple-200 px-4 py-1.5 text-xs font-black text-purple-800 shadow-xs">
                  <Sparkles size={14} className="text-amber-500" />
                  <span>{badge.title} ({badge.tier})</span>
                </div>
                <p className="text-[11px] text-slate-500 italic max-w-sm mx-auto">
                  "{badge.description}"
                </p>
              </div>

              {/* Seal & Signatures Footer */}
              <div className="mt-8 flex items-end justify-between border-t border-slate-200/80 pt-4 text-left text-xs">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                    Issued Date
                  </span>
                  <span className="font-semibold text-slate-700 text-[11px]">{issueDate}</span>
                </div>

                <div className="text-center">
                  <div className="mx-auto mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700">
                    <ShieldCheck size={20} />
                  </div>
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-amber-700">
                    Verified Seal
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                    Credential ID
                  </span>
                  <span className="font-mono font-bold text-purple-700 text-[11px]">
                    {credentialId}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t border-slate-100 bg-slate-50/80 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-600" />
                  <span className="text-emerald-600">Verification Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 size={14} />
                  <span>Copy Verification Link</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShareLinkedIn}
                className="flex items-center gap-1.5 rounded-xl bg-[#0a66c2] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#084e96] transition-colors"
              >
                <span>Share on LinkedIn</span>
                <ExternalLink size={12} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
