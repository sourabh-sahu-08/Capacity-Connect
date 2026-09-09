// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Users, 
  UserPlus, 
  UserCheck, 
  Briefcase, 
  Building, 
  MapPin, 
  Sparkles, 
  Filter, 
  Compass,
  GraduationCap,
  Shield,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../../api/user.api';
import type { UserSummary } from '../../api/user.api';
import { useAuthStore } from '../../store/authStore';
import { AppShell } from '../../components/layout/AppShell';
import { TrainerLayout } from '../../layouts/TrainerLayout';
import { ManagerLayout } from '../../layouts/ManagerLayout';

export const DiscoverNetworkView: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);

  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userApi.discoverUsers({
        q: searchQuery,
        role: roleFilter,
      });
      setUsers(res.data.users || []);
    } catch (err) {
      console.error('Failed to discover users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, roleFilter]);

  const handleToggleFollow = async (e: React.MouseEvent, user: UserSummary) => {
    e.stopPropagation();
    setActionLoading((prev) => ({ ...prev, [user.id]: true }));

    try {
      const res = await userApi.toggleFollow(user.id);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id
            ? {
                ...u,
                isFollowing: res.data.isFollowing,
                followersCount: res.data.followersCount,
              }
            : u
        )
      );
    } catch (err) {
      console.error('Follow toggle error', err);
    } finally {
      setActionLoading((prev) => ({ ...prev, [user.id]: false }));
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-20 text-slate-800">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-1 text-xs font-semibold text-purple-200 backdrop-blur-md">
            <Sparkles size={14} /> Capacity Network
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Discover Peers & Mentors</h1>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            Connect with fellow learners, industry trainers, and managers. Follow profiles to track competency milestones and collaborate.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, skill, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-purple-500 focus:bg-white transition-all"
          />
        </div>

        {/* Role Filters */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { label: 'All Roles', value: 'ALL' },
            { label: 'Learners', value: 'LEARNER' },
            { label: 'Trainers', value: 'TRAINER' },
            { label: 'Managers', value: 'MANAGER' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setRoleFilter(tab.value)}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all whitespace-nowrap ${
                roleFilter === tab.value
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Network Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-56 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm animate-pulse space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-slate-200" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-3/4 rounded bg-slate-200" />
                  <div className="h-3 w-1/2 rounded bg-slate-200" />
                </div>
              </div>
              <div className="h-3 w-full rounded bg-slate-100" />
              <div className="h-8 w-full rounded-xl bg-slate-100" />
            </div>
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 mb-4">
            <Users size={24} />
          </div>
          <h3 className="text-base font-bold text-slate-900">No matching profiles found</h3>
          <p className="mt-1 text-xs text-slate-500">
            {searchQuery ? 'Try adjusting your search query or role filter.' : 'Be the first to invite your colleagues!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {users.map((user) => {
            const isLoading = actionLoading[user.id];
            const roleBadgeStyle =
              user.role === 'ADMIN' ? 'bg-rose-50 text-rose-600 border-rose-200' :
              user.role === 'MANAGER' ? 'bg-amber-50 text-amber-600 border-amber-200' :
              user.role === 'TRAINER' ? 'bg-indigo-50 text-indigo-600 border-indigo-200' :
              'bg-purple-50 text-purple-600 border-purple-200';

            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                onClick={() => navigate(`/profile/${user.id}`)}
                className="group flex flex-col justify-between cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-purple-300 hover:shadow-md transition-all"
              >
                <div>
                  {/* Top Row: Avatar & Details */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-purple-100 text-purple-700 font-bold text-base flex items-center justify-center shadow-sm">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                        ) : (
                          user.name?.charAt(0).toUpperCase() || 'U'
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="truncate text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                            {user.name}
                          </h3>
                        </div>
                        <span className={`inline-block mt-0.5 rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${roleBadgeStyle}`}>
                          {user.role}
                        </span>
                      </div>
                    </div>

                    {user.readinessScore > 0 && (
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-black text-purple-600">{Math.round(user.readinessScore)}%</span>
                        <span className="text-[9px] text-slate-400 font-medium">Readiness</span>
                      </div>
                    )}
                  </div>

                  {/* Role & Org */}
                  <div className="mt-3 space-y-1 text-xs text-slate-500">
                    {user.currentRole && (
                      <div className="flex items-center gap-1.5 truncate">
                        <Briefcase size={13} className="text-purple-500 shrink-0" />
                        <span className="truncate">{user.currentRole}</span>
                      </div>
                    )}
                    {user.organization && (
                      <div className="flex items-center gap-1.5 truncate">
                        <Building size={13} className="text-slate-400 shrink-0" />
                        <span className="truncate">{user.organization}</span>
                      </div>
                    )}
                    {user.location && (
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin size={13} className="text-rose-400 shrink-0" />
                        <span className="truncate">{user.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Skills tags */}
                  {user.skillsList && user.skillsList.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {user.skillsList.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600"
                        >
                          {skill}
                        </span>
                      ))}
                      {user.skillsList.length > 3 && (
                        <span className="rounded-md bg-purple-50 px-1.5 py-0.5 text-[10px] font-bold text-purple-600">
                          +{user.skillsList.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Row: Followers & Follow Button */}
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3.5">
                  <span className="text-xs font-medium text-slate-500">
                    <strong className="text-slate-800">{user.followersCount || 0}</strong> followers
                  </span>

                  <button
                    onClick={(e) => handleToggleFollow(e, user)}
                    disabled={isLoading}
                    className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                      user.isFollowing
                        ? 'border border-slate-200 bg-white text-slate-700 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600'
                        : 'bg-purple-600 text-white shadow-sm hover:bg-purple-700'
                    }`}
                  >
                    {isLoading ? (
                      <span className="animate-spin text-xs">⏳</span>
                    ) : user.isFollowing ? (
                      <>
                        <UserCheck size={14} />
                        Following
                      </>
                    ) : (
                      <>
                        <UserPlus size={14} />
                        Follow
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const DiscoverNetwork: React.FC = () => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-12">
        <DiscoverNetworkView />
      </div>
    );
  }

  if (user.role === 'TRAINER') {
    return (
      <TrainerLayout>
        <DiscoverNetworkView />
      </TrainerLayout>
    );
  }

  if (user.role === 'MANAGER' || user.role === 'ADMIN') {
    return (
      <ManagerLayout>
        <DiscoverNetworkView />
      </ManagerLayout>
    );
  }

  return (
    <AppShell>
      <DiscoverNetworkView />
    </AppShell>
  );
};
