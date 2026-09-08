// @ts-nocheck
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, UserCheck, UserPlus, Sparkles, Building, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../../api/user.api';
import type { UserSummary } from '../../api/user.api';

interface FollowListModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  users: UserSummary[];
  loading?: boolean;
  onFollowToggle?: (userId: string, newStatus: boolean) => void;
}

export const FollowListModal: React.FC<FollowListModalProps> = ({
  isOpen,
  onClose,
  title,
  users,
  loading = false,
  onFollowToggle,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [localFollowState, setLocalFollowState] = useState<Record<string, boolean>>({});
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  if (!isOpen) return null;

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.currentRole?.toLowerCase().includes(q) ||
      u.organization?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    );
  });

  const handleToggleFollow = async (e: React.MouseEvent, user: UserSummary) => {
    e.stopPropagation();
    const currentStatus = localFollowState[user.id] !== undefined ? localFollowState[user.id] : user.isFollowing;
    setActionLoading((prev) => ({ ...prev, [user.id]: true }));

    try {
      const res = await userApi.toggleFollow(user.id);
      setLocalFollowState((prev) => ({ ...prev, [user.id]: res.data.isFollowing }));
      if (onFollowToggle) {
        onFollowToggle(user.id, res.data.isFollowing);
      }
    } catch (err) {
      console.error('Failed to toggle follow in modal', err);
    } finally {
      setActionLoading((prev) => ({ ...prev, [user.id]: false }));
    }
  };

  const handleUserClick = (userId: string) => {
    onClose();
    navigate(`/profile/${userId}`);
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

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl z-10 text-slate-800"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <Sparkles size={18} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                <p className="text-xs text-slate-500">{users.length} {users.length === 1 ? 'person' : 'people'}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Search bar */}
          <div className="relative mt-4">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, role, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-purple-500 focus:bg-white transition-colors"
            />
          </div>

          {/* User List */}
          <div className="mt-4 max-h-[380px] space-y-2 overflow-y-auto pr-1">
            {loading ? (
              <div className="py-12 text-center text-xs text-slate-400">Loading members...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm font-semibold text-slate-700">No users found</p>
                <p className="mt-1 text-xs text-slate-400">
                  {searchQuery ? 'Try adjusting your search criteria' : 'Nobody in this list yet.'}
                </p>
              </div>
            ) : (
              filteredUsers.map((u) => {
                const isCurrentlyFollowing =
                  localFollowState[u.id] !== undefined ? localFollowState[u.id] : u.isFollowing;
                const isLoading = actionLoading[u.id];

                return (
                  <div
                    key={u.id}
                    onClick={() => handleUserClick(u.id)}
                    className="group flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-slate-100 p-3 hover:border-purple-200 hover:bg-purple-50/40 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-purple-100 text-purple-700 font-bold text-sm flex items-center justify-center">
                        {u.avatar ? (
                          <img src={u.avatar} alt={u.name} className="h-full w-full object-cover" />
                        ) : (
                          u.name?.charAt(0) || 'U'
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                            {u.name}
                          </p>
                          <span className="rounded-md bg-purple-50 px-1.5 py-0.5 text-[10px] font-bold text-purple-600 uppercase">
                            {u.role}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                          {u.currentRole && (
                            <span className="flex items-center gap-1 truncate">
                              <Briefcase size={12} className="text-slate-400" />
                              {u.currentRole}
                            </span>
                          )}
                          {u.organization && (
                            <span className="flex items-center gap-1 truncate">
                              <Building size={12} className="text-slate-400" />
                              {u.organization}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {!u.isSelf && (
                      <button
                        onClick={(e) => handleToggleFollow(e, u)}
                        disabled={isLoading}
                        className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                          isCurrentlyFollowing
                            ? 'border border-slate-200 bg-white text-slate-700 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600'
                            : 'bg-purple-600 text-white shadow-sm hover:bg-purple-700'
                        }`}
                      >
                        {isLoading ? (
                          <span className="animate-spin text-xs">⏳</span>
                        ) : isCurrentlyFollowing ? (
                          <>
                            <UserCheck size={13} />
                            Following
                          </>
                        ) : (
                          <>
                            <UserPlus size={13} />
                            Follow
                          </>
                        )}
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
