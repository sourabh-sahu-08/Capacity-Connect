// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Zap, Calendar, Clock, Activity, Sparkles } from 'lucide-react';
import { userApi } from '../../api/user.api';
import type { ActivityDay, ActivityHeatmapResponse } from '../../api/user.api';

interface ActivityHeatmapProps {
  userId: string;
  theme?: 'light' | 'dark';
}

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({
  userId,
  theme = 'light',
}) => {
  const [range, setRange] = useState<'6months' | '1year'>('6months');
  const [data, setData] = useState<ActivityHeatmapResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredDay, setHoveredDay] = useState<{ day: ActivityDay; x: number; y: number } | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchActivity = async () => {
      setLoading(true);
      try {
        const res = await userApi.getActivityHeatmap(userId, range);
        setData(res.data);
      } catch (err) {
        console.error('Failed to load activity heatmap', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [userId, range]);

  // Group days into 7-day week columns
  const weeks: ActivityDay[][] = [];
  if (data?.days) {
    let currentWeek: ActivityDay[] = [];
    data.days.forEach((day, index) => {
      currentWeek.push(day);
      if (currentWeek.length === 7 || index === data.days.length - 1) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });
  }

  // Generate Month labels from weeks
  const monthLabels: Array<{ label: string; index: number }> = [];
  let lastMonth = '';
  weeks.forEach((week, index) => {
    if (week.length > 0) {
      const d = new Date(week[0].date);
      const m = d.toLocaleDateString(undefined, { month: 'short' });
      if (m !== lastMonth) {
        monthLabels.push({ label: m, index });
        lastMonth = m;
      }
    }
  });

  const getCellColor = (level: number) => {
    if (theme === 'dark') {
      switch (level) {
        case 1:
          return 'bg-purple-900/60 border-purple-700/50 hover:bg-purple-800';
        case 2:
          return 'bg-purple-600/70 border-purple-500/60 hover:bg-purple-500';
        case 3:
          return 'bg-purple-500 border-purple-400 hover:bg-purple-400';
        case 4:
          return 'bg-indigo-400 border-indigo-300 shadow-sm shadow-indigo-500/40 hover:bg-indigo-300';
        default:
          return 'bg-white/[0.04] border-white/[0.06] hover:bg-white/[0.08]';
      }
    } else {
      switch (level) {
        case 1:
          return 'bg-purple-200 border-purple-300 hover:bg-purple-300';
        case 2:
          return 'bg-purple-400 border-purple-500 hover:bg-purple-500 text-white';
        case 3:
          return 'bg-purple-600 border-purple-700 hover:bg-purple-700 text-white';
        case 4:
          return 'bg-purple-800 border-purple-900 shadow-xs hover:bg-purple-900 text-white';
        default:
          return 'bg-slate-100 border-slate-200/70 hover:bg-slate-200/80';
      }
    }
  };

  const isDark = theme === 'dark';

  return (
    <div
      className={`rounded-2xl border p-6 shadow-sm relative ${
        isDark
          ? 'border-white/10 bg-white/[0.03] text-slate-100'
          : 'border-slate-200 bg-white text-slate-800'
      }`}
    >
      {/* Header & Range Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 mb-5 border-inherit">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-50 text-purple-600'}`}>
              <Activity size={16} />
            </div>
            <h3 className="text-sm font-bold tracking-tight">Learning & Contribution Activity</h3>
          </div>
          <p className="text-xs text-slate-400">
            Daily consistency tracker across assessments, course labs, and competency progress.
          </p>
        </div>

        {/* Range Buttons */}
        <div className="flex items-center gap-1 self-start sm:self-auto rounded-xl border border-slate-200/60 p-1 bg-slate-50/50">
          <button
            type="button"
            onClick={() => setRange('6months')}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all ${
              range === '6months'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            6 Months
          </button>
          <button
            type="button"
            onClick={() => setRange('1year')}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all ${
              range === '1year'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            1 Year
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className={`p-3 rounded-xl border ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-slate-50/80 border-slate-100'}`}>
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
            <Flame size={13} className="text-amber-500" /> Current Streak
          </div>
          <span className="text-lg font-extrabold text-amber-500 mt-1 block">
            {data?.metrics?.currentStreak || 0} {data?.metrics?.currentStreak === 1 ? 'Day' : 'Days'}
          </span>
        </div>

        <div className={`p-3 rounded-xl border ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-slate-50/80 border-slate-100'}`}>
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
            <Zap size={13} className="text-purple-500" /> Longest Streak
          </div>
          <span className="text-lg font-extrabold text-purple-600 mt-1 block">
            {data?.metrics?.longestStreak || 0} Days
          </span>
        </div>

        <div className={`p-3 rounded-xl border ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-slate-50/80 border-slate-100'}`}>
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
            <Calendar size={13} className="text-emerald-500" /> Active Days
          </div>
          <span className="text-lg font-extrabold text-emerald-600 mt-1 block">
            {data?.metrics?.totalActiveDays || 0} Days
          </span>
        </div>

        <div className={`p-3 rounded-xl border ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-slate-50/80 border-slate-100'}`}>
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
            <Clock size={13} className="text-indigo-500" /> Practice Time
          </div>
          <span className="text-lg font-extrabold text-indigo-600 mt-1 block">
            ~{data?.metrics?.totalHours || 0} hrs
          </span>
        </div>
      </div>

      {/* Heatmap Grid */}
      {loading ? (
        <div className="h-32 flex items-center justify-center">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 animate-pulse">
            <Sparkles size={15} /> Calculating learning cadence...
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto pb-2">
          <div className="inline-block min-w-full">
            {/* Month labels header */}
            <div className="flex text-[10px] text-slate-400 font-medium mb-1.5 pl-6 gap-1">
              {weeks.map((_, i) => {
                const labelObj = monthLabels.find((m) => m.index === i);
                return (
                  <div key={i} className="w-3 text-center shrink-0">
                    {labelObj ? labelObj.label : ''}
                  </div>
                );
              })}
            </div>

            {/* Grid with day labels */}
            <div className="flex items-start gap-1.5">
              {/* Day of week labels */}
              <div className="flex flex-col gap-1 text-[9px] text-slate-400 font-semibold pr-1 pt-0.5">
                <span className="h-3 leading-3">Mon</span>
                <span className="h-3 leading-3 opacity-0">Tue</span>
                <span className="h-3 leading-3">Wed</span>
                <span className="h-3 leading-3 opacity-0">Thu</span>
                <span className="h-3 leading-3">Fri</span>
                <span className="h-3 leading-3 opacity-0">Sat</span>
                <span className="h-3 leading-3 opacity-0">Sun</span>
              </div>

              {/* Week columns */}
              <div className="flex gap-1">
                {weeks.map((week, weekIdx) => (
                  <div key={weekIdx} className="flex flex-col gap-1 shrink-0">
                    {week.map((day, dayIdx) => (
                      <div
                        key={day.date || dayIdx}
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setHoveredDay({
                            day,
                            x: rect.left + rect.width / 2,
                            y: rect.top - 8,
                          });
                        }}
                        onMouseLeave={() => setHoveredDay(null)}
                        className={`h-3 w-3 rounded-xs border cursor-pointer transition-all duration-150 ${getCellColor(
                          day.level
                        )}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-inherit">
              <span>{data?.metrics?.totalActivities || 0} learning milestones completed</span>
              <div className="flex items-center gap-1.5 text-[10px]">
                <span>Less</span>
                <span className={`h-2.5 w-2.5 rounded-xs border ${getCellColor(0)}`} />
                <span className={`h-2.5 w-2.5 rounded-xs border ${getCellColor(1)}`} />
                <span className={`h-2.5 w-2.5 rounded-xs border ${getCellColor(2)}`} />
                <span className={`h-2.5 w-2.5 rounded-xs border ${getCellColor(3)}`} />
                <span className={`h-2.5 w-2.5 rounded-xs border ${getCellColor(4)}`} />
                <span>More</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Tooltip */}
      <AnimatePresence>
        {hoveredDay && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            style={{
              position: 'fixed',
              left: `${hoveredDay.x}px`,
              top: `${hoveredDay.y}px`,
              transform: 'translate(-50%, -100%)',
              pointerEvents: 'none',
              zIndex: 9999,
            }}
            className="rounded-lg bg-slate-900 px-2.5 py-1.5 text-center text-[11px] font-semibold text-white shadow-xl border border-slate-700 whitespace-nowrap"
          >
            {hoveredDay.day.tooltip}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
