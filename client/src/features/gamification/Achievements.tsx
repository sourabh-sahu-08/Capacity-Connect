// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Star, 
  Zap, 
  Brain, 
  Flame, 
  Target, 
  Award, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  FolderGit2, 
  Quote, 
  Users, 
  Compass, 
  Share2,
  Calendar,
  ExternalLink,
  ChevronRight,
  Clock
} from 'lucide-react';
import { gamificationApi } from '../../api/gamification.api';
import type { GamificationProfileResponse, WeeklyQuest, GamificationBadge } from '../../api/gamification.api';
import { LeaderboardView } from './LeaderboardView';
import { CertificateModal } from './CertificateModal';
import { useAuthStore } from '../../store/authStore';

export const Achievements: React.FC = () => {
  const currentUser = useAuthStore((state) => state.user);

  const [activeTab, setActiveTab] = useState<'quests' | 'leaderboard' | 'badges'>('leaderboard');
  const [profileData, setProfileData] = useState<GamificationProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Certificate Modal State
  const [selectedBadgeForCert, setSelectedBadgeForCert] = useState<GamificationBadge | null>(null);

  useEffect(() => {
    const fetchGamificationData = async () => {
      setLoading(true);
      try {
        const res = await gamificationApi.getGamificationProfile();
        setProfileData(res.data);
      } catch (err) {
        console.error('Failed to load gamification profile', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGamificationData();
  }, []);

  const stats = profileData?.stats;
  const quests = profileData?.quests || [];
  const badges = profileData?.badges || [];

  const completedQuestsCount = quests.filter((q) => q.completed).length;
  const unlockedBadgesCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="p-6 md:p-10 space-y-8 text-slate-900 max-w-6xl mx-auto">
      {/* Hero XP & Progression Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-purple-200/80 bg-linear-to-r from-purple-950 via-indigo-900 to-slate-950 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-18 w-18 items-center justify-center rounded-2xl bg-linear-to-tr from-amber-400 to-amber-600 text-slate-950 font-black text-2xl shadow-lg shadow-amber-500/30">
                {stats?.level || 1}
              </div>
              <span className="absolute -bottom-2 -right-1 rounded-md bg-purple-600 px-1.5 py-0.5 text-[9px] font-black uppercase text-white shadow-xs">
                LVL
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-black text-white">
                  {currentUser?.name || 'Developer'}
                </h1>
                <span className="rounded-lg bg-purple-500/30 border border-purple-400/30 px-2 py-0.5 text-xs font-bold text-purple-200">
                  {stats?.level && stats.level >= 5 ? 'Senior Achiever' : 'Active Learner'}
                </span>
              </div>
              <p className="text-xs text-purple-200 mt-1">
                Capacity-Connect Gamification Hub • Climb ranks, complete quests & earn verified certificates.
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
            <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3 text-center min-w-[90px]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 block">
                Total XP
              </span>
              <span className="text-base font-black text-amber-400 mt-0.5 block flex items-center justify-center gap-1">
                <Zap size={15} /> {stats?.totalXP ? stats.totalXP.toLocaleString() : '150'}
              </span>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3 text-center min-w-[90px]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 block">
                Streak
              </span>
              <span className="text-base font-black text-amber-400 mt-0.5 block flex items-center justify-center gap-1">
                <Flame size={15} className="fill-amber-400" /> {stats?.streakDays || 1}d
              </span>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3 text-center min-w-[90px]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 block">
                Badges
              </span>
              <span className="text-base font-black text-emerald-400 mt-0.5 block flex items-center justify-center gap-1">
                <ShieldCheck size={15} /> {unlockedBadgesCount}
              </span>
            </div>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        {stats && (
          <div className="relative z-10 mt-6 pt-5 border-t border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs text-purple-200">
              <span className="font-semibold flex items-center gap-1">
                <Sparkles size={13} className="text-amber-400" /> Level {stats.level} Progress
              </span>
              <span className="font-mono text-[11px]">
                {stats.totalXP} / {stats.nextLevelBaseXP} XP ({stats.levelProgressPercent}%)
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats.levelProgressPercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full bg-linear-to-r from-purple-500 via-indigo-400 to-amber-400 shadow-sm"
              />
            </div>
          </div>
        )}
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { id: 'leaderboard', label: 'Leaderboards & Rankings', icon: Trophy },
          { id: 'quests', label: `Weekly Quests (${completedQuestsCount}/${quests.length})`, icon: Target },
          { id: 'badges', label: `Certifications & Badges (${unlockedBadgesCount})`, icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-amber-300' : 'text-slate-400'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Leaderboards */}
      {activeTab === 'leaderboard' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <LeaderboardView />
        </motion.div>
      )}

      {/* TAB 2: Weekly Quests */}
      {activeTab === 'quests' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-6"
        >
          {/* Quests Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Target size={18} className="text-purple-600" /> Active Weekly Challenges
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Complete targeted real-world actions to earn bonus XP and boost your leaderboard standing.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-xl self-start sm:self-auto">
              <Clock size={14} className="text-purple-600" />
              <span>Resets every Monday</span>
            </div>
          </div>

          {/* Quests List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {quests.map((quest) => (
              <div
                key={quest.id}
                className={`flex flex-col justify-between rounded-2xl border p-6 transition-all ${
                  quest.completed
                    ? 'border-emerald-200 bg-emerald-50/40 shadow-xs'
                    : 'border-slate-200 bg-white shadow-sm hover:border-purple-200'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                          quest.completed
                            ? 'bg-emerald-100 text-emerald-700 shadow-xs'
                            : 'bg-purple-50 text-purple-600'
                        }`}
                      >
                        {quest.completed ? <CheckCircle2 size={22} /> : <Zap size={22} />}
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600 block">
                          {quest.category}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">{quest.title}</h4>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 rounded-xl bg-amber-100 px-2.5 py-1 text-xs font-extrabold text-amber-900">
                      +{quest.xpReward} XP
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{quest.description}</p>
                </div>

                {/* Progress Bar */}
                <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Challenge Progress</span>
                    <span className="font-bold text-slate-900">
                      {quest.currentProgress} / {quest.maxProgress}
                    </span>
                  </div>

                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        quest.completed ? 'bg-emerald-500' : 'bg-purple-600'
                      }`}
                      style={{
                        width: `${Math.min(100, Math.round((quest.currentProgress / quest.maxProgress) * 100))}%`,
                      }}
                    />
                  </div>

                  {quest.completed && (
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 pt-1">
                      <CheckCircle2 size={13} /> Completed • Reward Granted
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* TAB 3: Badges & Certifications */}
      {activeTab === 'badges' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award size={18} className="text-purple-600" /> Verified Badges & Credentials
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Click any unlocked badge to generate, preview, and share your official Certificate of Achievement.
              </p>
            </div>
          </div>

          {/* Badges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {badges.map((badge) => {
              const tierBadgeColor =
                badge.tier === 'LEGENDARY'
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : badge.tier === 'EPIC'
                  ? 'bg-purple-100 text-purple-800 border-purple-200'
                  : badge.tier === 'RARE'
                  ? 'bg-indigo-100 text-indigo-800 border-indigo-200'
                  : 'bg-slate-100 text-slate-700 border-slate-200';

              return (
                <motion.div
                  key={badge.id}
                  whileHover={{ y: -3 }}
                  onClick={() => {
                    if (badge.unlocked) {
                      setSelectedBadgeForCert(badge);
                    }
                  }}
                  className={`group flex flex-col justify-between rounded-2xl border p-6 transition-all ${
                    badge.unlocked
                      ? 'border-slate-200 bg-white shadow-sm hover:border-purple-300 hover:shadow-lg cursor-pointer'
                      : 'border-slate-200/60 bg-slate-50/70 opacity-60'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm ${
                          badge.unlocked
                            ? 'bg-linear-to-tr from-purple-600 to-indigo-600 text-white shadow-purple-500/20'
                            : 'bg-slate-200 text-slate-400'
                        }`}
                      >
                        <Award size={28} />
                      </div>

                      <span
                        className={`rounded-lg border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${tierBadgeColor}`}
                      >
                        {badge.tier}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-extrabold text-slate-900 group-hover:text-purple-700 transition-colors">
                        {badge.title}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1">
                        {badge.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    {badge.unlocked ? (
                      <>
                        <span className="font-bold text-purple-600 flex items-center gap-1 group-hover:underline">
                          <span>View Certificate</span>
                          <ChevronRight size={14} />
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {badge.unlockedAt
                            ? new Date(badge.unlockedAt).toLocaleDateString(undefined, {
                                month: 'short',
                                year: 'numeric',
                              })
                            : 'Unlocked'}
                        </span>
                      </>
                    ) : (
                      <span className="text-[11px] font-semibold text-slate-400 italic">
                        Locked • Continue learning to earn
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={!!selectedBadgeForCert}
        onClose={() => setSelectedBadgeForCert(null)}
        badge={selectedBadgeForCert}
        userName={currentUser?.name || 'Developer'}
        userRole={currentUser?.currentRole || currentUser?.role}
        organization={currentUser?.organization}
      />
    </div>
  );
};
