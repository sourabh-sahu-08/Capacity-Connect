// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Crown, 
  Flame, 
  Star, 
  Sparkles, 
  Award, 
  Building, 
  Users, 
  Globe, 
  ArrowUp, 
  Brain, 
  FolderGit2, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { gamificationApi } from '../../api/gamification.api';
import type { LeaderboardEntry, CurrentUserRankInfo } from '../../api/gamification.api';
import { useAuthStore } from '../../store/authStore';

export const LeaderboardView: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);

  const [scope, setScope] = useState<'global' | 'organization'>('global');
  const [category, setCategory] = useState<'xp' | 'competency' | 'streak'>('xp');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState<CurrentUserRankInfo | null>(null);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [avgLevel, setAvgLevel] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const res = await gamificationApi.getLeaderboard({ scope, category });
        setLeaderboard(res.data.leaderboard || []);
        setCurrentUserRank(res.data.currentUserRank);
        setTotalParticipants(res.data.totalParticipants || 0);
        setAvgLevel(res.data.avgLevel || 1);
      } catch (err) {
        console.error('Failed to fetch leaderboard', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [scope, category]);

  const topThree = leaderboard.slice(0, 3);
  const remainingRanks = leaderboard.slice(3);

  return (
    <div className="space-y-8">
      {/* Scope & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        {/* Global vs Organization Toggle */}
        <div className="flex items-center gap-1.5 rounded-xl bg-slate-100 p-1">
          <button
            onClick={() => setScope('global')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-extrabold transition-all ${
              scope === 'global'
                ? 'bg-white text-purple-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe size={14} />
            <span>Global Community</span>
          </button>
          <button
            onClick={() => setScope('organization')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-extrabold transition-all ${
              scope === 'organization'
                ? 'bg-white text-purple-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building size={14} />
            <span>My Organization</span>
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'xp', label: 'Overall XP', icon: Zap },
            { id: 'competency', label: 'Competency DNA', icon: Brain },
            { id: 'streak', label: 'Streak Flames', icon: Flame },
          ].map((cat) => {
            const Icon = cat.icon;
            const isSelected = category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id as any)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon size={13} className={isSelected ? 'text-amber-300' : 'text-slate-400'} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400 space-y-3">
          <div className="h-8 w-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p>Calculating leaderboard rankings...</p>
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
          <Trophy size={36} className="mx-auto text-slate-300 mb-2" />
          <h4 className="text-sm font-bold text-slate-700">No Learners in this Leaderboard Yet</h4>
          <p className="text-xs text-slate-400 mt-1">
            Complete assessments and publish projects to become the first on the podium!
          </p>
        </div>
      ) : (
        <>
          {/* Top 3 Podium */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end pt-6 pb-2">
            {/* Rank 2 - Silver (Left on Desktop) */}
            {topThree[1] && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="order-2 md:order-1 flex flex-col items-center"
              >
                <div
                  onClick={() => navigate(`/profile/${topThree[1].id}`)}
                  className="group relative cursor-pointer flex flex-col items-center text-center w-full"
                >
                  {/* Avatar with Silver Ring */}
                  <div className="relative mb-3">
                    <div className="h-20 w-20 rounded-full border-4 border-slate-300 bg-slate-100 p-0.5 shadow-lg group-hover:scale-105 transition-transform overflow-hidden">
                      <img
                        src={
                          topThree[1].avatar ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${topThree[1].id}`
                        }
                        alt={topThree[1].name}
                        className="h-full w-full rounded-full object-cover"
                      />
                    </div>
                    <span className="absolute -top-3 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-slate-300 border-2 border-white text-xs font-black text-slate-800 shadow-md">
                      2
                    </span>
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-purple-600 transition-colors">
                    {topThree[1].name}
                  </h3>
                  <p className="text-[11px] text-slate-500 truncate max-w-[180px]">
                    {topThree[1].currentRole || topThree[1].organization || 'Engineer'}
                  </p>

                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                    <Zap size={12} className="text-amber-500" />
                    <span>{topThree[1].totalXP.toLocaleString()} XP</span>
                  </div>
                </div>

                {/* Pedestal */}
                <div className="mt-4 w-full h-24 rounded-t-2xl bg-linear-to-b from-slate-200 to-slate-100 border-t-4 border-slate-300 flex items-center justify-center shadow-sm">
                  <span className="text-xl font-black text-slate-400">2nd Place</span>
                </div>
              </motion.div>
            )}

            {/* Rank 1 - Gold (Center, Elevated) */}
            {topThree[0] && (
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="order-1 md:order-2 flex flex-col items-center"
              >
                <div
                  onClick={() => navigate(`/profile/${topThree[0].id}`)}
                  className="group relative cursor-pointer flex flex-col items-center text-center w-full"
                >
                  <Crown size={28} className="text-amber-400 fill-amber-400 animate-bounce mb-1" />

                  {/* Avatar with Gold Ring & Glow */}
                  <div className="relative mb-3">
                    <div className="h-24 w-24 rounded-full border-4 border-amber-400 bg-amber-50 p-1 shadow-xl shadow-amber-500/20 group-hover:scale-105 transition-transform overflow-hidden">
                      <img
                        src={
                          topThree[0].avatar ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${topThree[0].id}`
                        }
                        alt={topThree[0].name}
                        className="h-full w-full rounded-full object-cover"
                      />
                    </div>
                    <span className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 border-2 border-white text-xs font-black text-slate-950 shadow-md">
                      1
                    </span>
                  </div>

                  <h3 className="text-base font-black text-slate-900 group-hover:text-purple-600 transition-colors">
                    {topThree[0].name}
                  </h3>
                  <p className="text-xs text-slate-500 truncate max-w-[200px]">
                    {topThree[0].currentRole || topThree[0].organization || 'Lead Architect'}
                  </p>

                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-amber-100 border border-amber-300 px-3.5 py-1 text-xs font-extrabold text-amber-900 shadow-xs">
                    <Sparkles size={13} className="text-amber-600" />
                    <span>{topThree[0].totalXP.toLocaleString()} XP</span>
                  </div>
                </div>

                {/* Pedestal */}
                <div className="mt-4 w-full h-32 rounded-t-2xl bg-linear-to-b from-amber-300 via-amber-200 to-amber-100 border-t-4 border-amber-400 flex items-center justify-center shadow-md">
                  <div className="text-center">
                    <Trophy size={20} className="mx-auto text-amber-700 fill-amber-600 mb-0.5" />
                    <span className="text-lg font-black text-amber-900">Champion</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Rank 3 - Bronze (Right on Desktop) */}
            {topThree[2] && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="order-3 flex flex-col items-center"
              >
                <div
                  onClick={() => navigate(`/profile/${topThree[2].id}`)}
                  className="group relative cursor-pointer flex flex-col items-center text-center w-full"
                >
                  {/* Avatar with Bronze Ring */}
                  <div className="relative mb-3">
                    <div className="h-20 w-20 rounded-full border-4 border-amber-600/40 bg-amber-50 p-0.5 shadow-lg group-hover:scale-105 transition-transform overflow-hidden">
                      <img
                        src={
                          topThree[2].avatar ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${topThree[2].id}`
                        }
                        alt={topThree[2].name}
                        className="h-full w-full rounded-full object-cover"
                      />
                    </div>
                    <span className="absolute -top-3 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-amber-700 border-2 border-white text-xs font-black text-white shadow-md">
                      3
                    </span>
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-purple-600 transition-colors">
                    {topThree[2].name}
                  </h3>
                  <p className="text-[11px] text-slate-500 truncate max-w-[180px]">
                    {topThree[2].currentRole || topThree[2].organization || 'Developer'}
                  </p>

                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-bold text-amber-800">
                    <Zap size={12} className="text-amber-600" />
                    <span>{topThree[2].totalXP.toLocaleString()} XP</span>
                  </div>
                </div>

                {/* Pedestal */}
                <div className="mt-4 w-full h-20 rounded-t-2xl bg-linear-to-b from-amber-100 to-amber-50 border-t-4 border-amber-600/30 flex items-center justify-center shadow-sm">
                  <span className="text-xl font-black text-amber-800/60">3rd Place</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Remaining Ranks Table (Ranks 4+) */}
          {remainingRanks.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
              <div className="bg-slate-50/80 px-6 py-3 border-b border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>Rank & Developer</span>
                <div className="flex items-center gap-8 pr-4">
                  <span className="hidden sm:inline">Streak</span>
                  <span className="hidden sm:inline">Level</span>
                  <span>Total XP</span>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {remainingRanks.map((entry) => {
                  const isSelf = currentUser?.id === entry.id;
                  return (
                    <div
                      key={entry.id}
                      onClick={() => navigate(`/profile/${entry.id}`)}
                      className={`flex items-center justify-between px-6 py-3.5 hover:bg-purple-50/40 cursor-pointer transition-colors ${
                        isSelf ? 'bg-purple-50/80 border-l-4 border-purple-600' : ''
                      }`}
                    >
                      {/* Left: Rank & User Info */}
                      <div className="flex items-center gap-4 min-w-0">
                        <span className="w-6 text-center text-sm font-extrabold text-slate-400">
                          #{entry.rank}
                        </span>

                        <img
                          src={
                            entry.avatar ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.id}`
                          }
                          alt={entry.name}
                          className="h-10 w-10 rounded-full object-cover border border-slate-200 shrink-0"
                        />

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold text-slate-900 truncate">
                              {entry.name}
                            </span>
                            {isSelf && (
                              <span className="rounded-md bg-purple-100 px-1.5 py-0.2 text-[10px] font-extrabold text-purple-700">
                                YOU
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 truncate">
                            {entry.currentRole || entry.organization || entry.role}
                          </p>
                        </div>
                      </div>

                      {/* Right: Stats & Score */}
                      <div className="flex items-center gap-8">
                        {/* Streak */}
                        <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-amber-600">
                          <Flame size={14} className="fill-amber-500" />
                          <span>{entry.streakDays}d</span>
                        </div>

                        {/* Level */}
                        <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-lg">
                          <span>Lvl {entry.level}</span>
                        </div>

                        {/* XP Badge */}
                        <div className="text-right min-w-[70px]">
                          <span className="text-sm font-black text-purple-700">
                            {entry.totalXP.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold block">XP</span>
                        </div>

                        <ChevronRight size={16} className="text-slate-300" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sticky Current User Rank Bar */}
          {currentUserRank && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="sticky bottom-4 z-20 rounded-2xl border-2 border-purple-500 bg-linear-to-r from-purple-900 via-indigo-900 to-slate-900 p-4 text-white shadow-2xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500 text-white font-black text-base shadow-md">
                  #{currentUserRank.rank}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">Your Leaderboard Ranking</span>
                    <span className="text-xs text-purple-300 font-medium">
                      (Top {Math.max(1, Math.round((currentUserRank.rank / totalParticipants) * 100))}%)
                    </span>
                  </div>
                  <p className="text-xs text-purple-200">
                    {currentUserRank.nextRankUserName
                      ? `Gain +${currentUserRank.xpToNextRank} XP to pass ${currentUserRank.nextRankUserName}!`
                      : 'You are at the top of the leaderboard! 👑'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-base font-black text-amber-400">
                    {currentUserRank.totalXP.toLocaleString()} XP
                  </span>
                  <span className="text-[10px] text-purple-300 block">Level {currentUserRank.level}</span>
                </div>

                <button
                  onClick={() => navigate('/profile')}
                  className="rounded-xl bg-purple-500 hover:bg-purple-400 px-4 py-2 text-xs font-bold text-white shadow-md transition-colors"
                >
                  View Profile
                </button>
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};
