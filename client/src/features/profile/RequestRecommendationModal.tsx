// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, UserCheck, Sparkles, AlertCircle, CheckCircle2, Search, Users } from 'lucide-react';
import { userApi } from '../../api/user.api';
import type { UserSummary } from '../../api/user.api';

interface RequestRecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
  onSuccess?: () => void;
}

const RELATIONSHIPS = [
  'Collaborated together as peer engineers',
  'Trained / Mentored me',
  'Managed / Led my team',
  'Worked on the same project deliverable',
  'Technical Advisor / Senior Colleague',
];

export const RequestRecommendationModal: React.FC<RequestRecommendationModalProps> = ({
  isOpen,
  onClose,
  currentUserId,
  onSuccess,
}) => {
  const [connections, setConnections] = useState<UserSummary[]>([]);
  const [loadingConnections, setLoadingConnections] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserSummary | null>(null);
  const [relationship, setRelationship] = useState(RELATIONSHIPS[0]);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentSuccess, setSentSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen || !currentUserId) return;

    const loadConnections = async () => {
      setLoadingConnections(true);
      try {
        const [followersRes, followingRes] = await Promise.all([
          userApi.getFollowers(currentUserId).catch(() => ({ data: { followers: [] } })),
          userApi.getFollowing(currentUserId).catch(() => ({ data: { following: [] } })),
        ]);

        const combinedMap = new Map<string, UserSummary>();
        (followingRes.data.following || []).forEach((u) => combinedMap.set(u.id, u));
        (followersRes.data.followers || []).forEach((u) => combinedMap.set(u.id, u));
        combinedMap.delete(currentUserId);

        const list = Array.from(combinedMap.values());
        setConnections(list);
        if (list.length > 0 && !selectedUser) {
          setSelectedUser(list[0]);
        }
      } catch (err) {
        console.error('Failed to load connections', err);
      } finally {
        setLoadingConnections(false);
      }
    };

    loadConnections();
    setSentSuccess(false);
    setError(null);
  }, [isOpen, currentUserId]);

  if (!isOpen) return null;

  const filteredConnections = connections.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.currentRole && c.currentRole.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) {
      setError('Please select a connection to ask for a recommendation.');
      return;
    }

    setSending(true);
    setError(null);

    try {
      await userApi.requestRecommendation({
        targetUserId: selectedUser.id,
        relationship,
        message: message.trim() || 'Hi! I would really appreciate it if you could write a brief recommendation for my profile based on our work together.',
      });

      setSentSuccess(true);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        onClose();
      }, 1600);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send request. Please try again.');
    } finally {
      setSending(false);
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
          className="fixed inset-0 bg-slate-950/65 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl z-10 text-slate-800"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-xs">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Request a Recommendation
                </h3>
                <p className="text-xs text-slate-500">
                  Ask a mentor, colleague, or team leader to vouch for your work.
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

          {sentSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-10 text-center space-y-3"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 size={32} />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Request Sent!</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                We've notified <span className="font-bold text-slate-700">{selectedUser?.name}</span> with your recommendation request.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {error && (
                <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-700 flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Select Connection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  1. Choose from your connections *
                </label>

                {connections.length > 4 && (
                  <div className="relative mb-2">
                    <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search connections..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-xs text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                    />
                  </div>
                )}

                <div className="max-h-36 overflow-y-auto rounded-2xl border border-slate-200 divide-y divide-slate-100 bg-slate-50/50">
                  {loadingConnections ? (
                    <div className="p-4 text-center text-xs text-slate-400">Loading your connections...</div>
                  ) : filteredConnections.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">
                      {connections.length === 0
                        ? 'You do not have any connected followers yet. Follow peers in Discover Network first!'
                        : 'No matching connection found.'}
                    </div>
                  ) : (
                    filteredConnections.map((user) => {
                      const isSelected = selectedUser?.id === user.id;
                      return (
                        <div
                          key={user.id}
                          onClick={() => setSelectedUser(user)}
                          className={`flex items-center gap-3 p-2.5 cursor-pointer transition-colors ${
                            isSelected ? 'bg-indigo-50/90 text-indigo-900' : 'hover:bg-slate-100/70'
                          }`}
                        >
                          <img
                            src={
                              user.avatar ||
                              `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`
                            }
                            alt={user.name}
                            className="h-8 w-8 rounded-full object-cover border border-slate-200"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-800 truncate">{user.name}</p>
                            <p className="text-[11px] text-slate-500 truncate">
                              {user.currentRole || user.role}
                            </p>
                          </div>
                          {isSelected && (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white shrink-0">
                              <UserCheck size={12} />
                            </span>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Relationship */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  2. Your working relationship
                </label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium"
                >
                  {RELATIONSHIPS.map((r, i) => (
                    <option key={i} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Custom message */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  3. Personal Note (Optional)
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Hi! Would you mind sharing a brief testimonial on my technical skills and collaboration for my Capacity-Connect profile?"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800 outline-none focus:border-indigo-500 focus:bg-white resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending || !selectedUser}
                  className="flex items-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-md shadow-indigo-500/20 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 transition-all"
                >
                  <Send size={13} />
                  <span>{sending ? 'Sending Request...' : 'Send Request'}</span>
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
