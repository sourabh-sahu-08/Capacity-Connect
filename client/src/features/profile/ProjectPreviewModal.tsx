// @ts-nocheck
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ExternalLink, 
  Star, 
  FolderGit2, 
  Share2, 
  Check, 
  Sparkles, 
  Calendar, 
  Maximize2, 
  Minimize2,
  Tag,
  Code2,
  Globe
} from 'lucide-react';
import type { UserProject } from '../../api/user.api';

const GithubIcon: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

interface ProjectPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: UserProject | null;
  authorName?: string;
  authorAvatar?: string;
  isOwner?: boolean;
  onEdit?: (project: UserProject) => void;
}

export const ProjectPreviewModal: React.FC<ProjectPreviewModalProps> = ({
  isOpen,
  onClose,
  project,
  authorName,
  authorAvatar,
  isOwner,
  onEdit,
}) => {
  const [copied, setCopied] = useState(false);
  const [showIframe, setShowIframe] = useState(false);

  if (!isOpen || !project) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = project.createdAt
    ? new Date(project.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
    : null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-2xl z-10 text-slate-800 max-h-[92vh] flex flex-col"
        >
          {/* Cover Media Banner */}
          <div className="relative h-56 sm:h-64 w-full bg-slate-900 overflow-hidden shrink-0">
            {project.imageUrl ? (
              <img
                src={project.imageUrl}
                alt={project.title}
                className="h-full w-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
              />
            ) : (
              <div className="h-full w-full bg-linear-to-tr from-purple-900 via-indigo-800 to-slate-900 flex items-center justify-center">
                <FolderGit2 className="h-20 w-20 text-white/20" />
              </div>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white/90 backdrop-blur-md hover:bg-black/80 transition-all shadow-lg"
            >
              <X size={18} />
            </button>

            {/* Badges on Banner */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              {project.featured && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/90 px-3 py-1 text-xs font-bold text-white shadow-lg backdrop-blur-xs">
                  <Star size={13} className="fill-white" />
                  Featured Project
                </span>
              )}
            </div>

            {/* Title & Author at Bottom of Banner */}
            <div className="absolute bottom-4 left-6 right-6">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-md">
                {project.title}
              </h2>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-white/80">
                {authorName && (
                  <div className="flex items-center gap-1.5 font-medium">
                    {authorAvatar ? (
                      <img
                        src={authorAvatar}
                        alt={authorName}
                        className="h-4 w-4 rounded-full object-cover border border-white/40"
                      />
                    ) : null}
                    <span>Built by {authorName}</span>
                  </div>
                )}
                {formattedDate && (
                  <div className="flex items-center gap-1 text-white/70">
                    <Calendar size={12} />
                    <span>{formattedDate}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-7 space-y-6">
            {/* Tech Stack & Tags */}
            {project.tags && project.tags.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                  <Code2 size={13} className="text-purple-600" />
                  Competency & Technologies
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 rounded-xl bg-purple-50/80 px-3 py-1 text-xs font-semibold text-purple-700 border border-purple-100"
                    >
                      <Tag size={10} className="opacity-60" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Project Overview */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Project Overview & Impact
              </h4>
              <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed font-normal">
                {project.description}
              </p>
            </div>

            {/* Optional Embedded Live Preview */}
            {project.demoUrl && showIframe && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: '360px' }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-900 shadow-inner"
              >
                <div className="flex items-center justify-between bg-slate-800 px-4 py-2 text-xs text-slate-300">
                  <span className="truncate">{project.demoUrl}</span>
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-purple-400 hover:text-purple-300 font-semibold"
                  >
                    Open Tab <ExternalLink size={12} />
                  </a>
                </div>
                <iframe
                  src={project.demoUrl}
                  title={project.title}
                  className="w-full h-[320px] border-0 bg-white"
                  sandbox="allow-scripts allow-same-origin"
                />
              </motion.div>
            )}
          </div>

          {/* Action Bar Footer */}
          <div className="border-t border-slate-100 bg-slate-50/80 p-4 sm:px-7 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              {isOwner && onEdit && (
                <button
                  onClick={() => {
                    onClose();
                    onEdit(project);
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Edit Project
                </button>
              )}
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                {copied ? (
                  <>
                    <Check size={14} className="text-emerald-600" />
                    <span className="text-emerald-600 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 size={14} />
                    <span>Share</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center gap-2">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-100 transition-all shadow-xs"
                >
                  <GithubIcon size={16} />
                  <span>Source Code</span>
                </a>
              )}

              {project.demoUrl && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setShowIframe(!showIframe)}
                    className="flex sm:inline-flex items-center gap-1 rounded-xl border border-purple-200 bg-purple-50/60 px-3 py-2.5 text-xs font-bold text-purple-700 hover:bg-purple-100 transition-all"
                    title={showIframe ? 'Hide preview' : 'Embed preview'}
                  >
                    {showIframe ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                    <span className="hidden sm:inline">{showIframe ? 'Collapse' : 'Preview'}</span>
                  </button>

                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-xs font-extrabold text-white hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md shadow-purple-500/20"
                  >
                    <Globe size={15} />
                    <span>Live Demo</span>
                    <ExternalLink size={13} className="opacity-80" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
