// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FolderGit2, Globe, Star, Sparkles, Image as ImageIcon, Tag, Trash2, Save } from 'lucide-react';
import { userApi } from '../../api/user.api';
import type { UserProject } from '../../api/user.api';

const GithubIcon: React.FC<{ size?: number; className?: string }> = ({ size = 14, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: UserProject | null;
  onSuccess: (project: UserProject, isEdit: boolean) => void;
  onDelete?: (projectId: string) => void;
}

const PRESET_COVERS = [
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
];

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  project,
  onSuccess,
  onDelete,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [featured, setFeatured] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (project) {
      setTitle(project.title || '');
      setDescription(project.description || '');
      setTagsInput(project.tags?.join(', ') || '');
      setGithubUrl(project.githubUrl || '');
      setDemoUrl(project.demoUrl || '');
      setImageUrl(project.imageUrl || '');
      setFeatured(!!project.featured);
    } else {
      setTitle('');
      setDescription('');
      setTagsInput('');
      setGithubUrl('');
      setDemoUrl('');
      setImageUrl(PRESET_COVERS[0]);
      setFeatured(false);
    }
    setError(null);
  }, [project, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const payload = {
        title,
        description,
        tags: parsedTags,
        githubUrl: githubUrl || undefined,
        demoUrl: demoUrl || undefined,
        imageUrl: imageUrl || undefined,
        featured,
      };

      if (project?.id) {
        const res = await userApi.updateProject(project.id, payload);
        onSuccess(res.data.project, true);
      } else {
        const res = await userApi.createProject(payload);
        onSuccess(res.data.project, false);
      }
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!project?.id || !onDelete) return;
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    setDeleting(true);
    try {
      await userApi.deleteProject(project.id);
      onDelete(project.id);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete project');
    } finally {
      setDeleting(false);
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

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl z-10 text-slate-800 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <FolderGit2 size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {project ? 'Edit Project Showcase' : 'Add New Project'}
                </h3>
                <p className="text-xs text-slate-500">
                  Highlight your engineering projects, open source repos, and live demos.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {error && (
            <div className="mt-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Project Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Distributed Task Queue & Telemetry Engine"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-purple-500 focus:bg-white transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Description & Architecture Highlights *
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the problem solved, architecture patterns used, scale, and outcomes..."
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-purple-500 focus:bg-white resize-none transition-all"
              />
            </div>

            {/* Links: GitHub & Live Demo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="flex items-center gap-1 text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  <GithubIcon size={13} className="text-slate-500" /> GitHub Repo URL
                </label>
                <input
                  type="text"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/user/project"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-purple-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="flex items-center gap-1 text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  <Globe size={13} className="text-purple-600" /> Live Demo URL
                </label>
                <input
                  type="text"
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  placeholder="https://myproject-demo.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-purple-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Tech Stack Tags */}
            <div>
              <label className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                <span className="flex items-center gap-1"><Tag size={13} className="text-purple-600" /> Tech Stack & Competency Tags</span>
                <span className="text-[10px] text-slate-400 font-normal">Click tags or type comma-separated</span>
              </label>
              
              {/* Quick Tag Suggestions */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Python', 'TailwindCSS', 'Docker', 'AI/ML', 'Next.js', 'GraphQL', 'AWS', 'Prisma'].map((tag) => {
                  const currentTags = tagsInput.split(',').map((t) => t.trim().toLowerCase());
                  const isIncluded = currentTags.includes(tag.toLowerCase());
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        if (isIncluded) {
                          const updated = tagsInput
                            .split(',')
                            .map((t) => t.trim())
                            .filter((t) => t.toLowerCase() !== tag.toLowerCase())
                            .join(', ');
                          setTagsInput(updated);
                        } else {
                          const updated = tagsInput ? `${tagsInput.trim()}, ${tag}` : tag;
                          setTagsInput(updated);
                        }
                      }}
                      className={`rounded-lg px-2 py-0.5 text-[11px] font-semibold transition-all ${
                        isIncluded
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {isIncluded ? `✓ ${tag}` : `+ ${tag}`}
                    </button>
                  );
                })}
              </div>

              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="React, TypeScript, Node.js, Redis, Docker, PostgreSQL"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-purple-500 focus:bg-white transition-all"
              />
            </div>

            {/* Cover Image & Presets */}
            <div>
              <label className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                <span className="flex items-center gap-1"><ImageIcon size={13} className="text-purple-600" /> Project Cover Image</span>
                <span className="text-[10px] text-slate-400 lowercase font-normal">click preset or enter URL</span>
              </label>
              <div className="flex gap-2 mb-2 overflow-x-auto pb-1">
                {PRESET_COVERS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImageUrl(preset)}
                    className={`h-12 w-16 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      imageUrl === preset ? 'border-purple-600 scale-105 shadow-sm' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={preset} alt="preset" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-purple-500 focus:bg-white transition-all"
              />
            </div>

            {/* Featured Switch */}
            <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-purple-50/40 p-3.5">
              <div className="flex items-center gap-2">
                <Star size={16} className={featured ? 'text-amber-500 fill-amber-500' : 'text-slate-400'} />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Feature on Profile Top</span>
                  <span className="text-[11px] text-slate-500">Pin this project at the top of your portfolio</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              {project?.id && onDelete ? (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors"
                >
                  <Trash2 size={14} />
                  {deleting ? 'Deleting...' : 'Delete Project'}
                </button>
              ) : <div />}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-purple-700 transition-all disabled:opacity-50"
                >
                  <Save size={14} />
                  {saving ? 'Saving...' : project ? 'Update Project' : 'Publish Project'}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
