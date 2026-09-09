import { useState, useEffect } from 'react';
import {
  Hexagon,
  Search,
  Users,
  ShieldAlert,
  TrendingUp,
  Award,
  RefreshCw,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { managerApi } from '../../api/manager.api';
import type { CapabilityMatrixResponse } from '../../api/manager.api';

export const CapabilityIntelligence = () => {
  const [data, setData] = useState<CapabilityMatrixResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCell, setSelectedCell] = useState<{
    learnerName: string;
    skillName: string;
    category: string;
    score: number;
    confidence: number;
    evidenceCount: number;
    lastUpdated: string | null;
  } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await managerApi.getCapabilityMatrix();
      setData(res);
    } catch (err: any) {
      console.error('Failed to load capability matrix:', err);
      setError(err?.response?.data?.error || 'Failed to generate capability heatmap.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const categories = ['ALL', 'technical', 'analytical', 'communication', 'leadership', 'creativity'];

  const filteredSkills = (data?.skills || []).filter(skill => {
    if (selectedCategory === 'ALL') return true;
    return skill.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const filteredMatrix = (data?.matrix || []).filter(row => {
    const nameMatch = row.learner.name.toLowerCase().includes(searchQuery.toLowerCase());
    const roleMatch = row.learner.currentRole.toLowerCase().includes(searchQuery.toLowerCase());
    const emailMatch = row.learner.email.toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || roleMatch || emailMatch;
  });

  const getHeatmapColor = (score: number) => {
    if (!score || score === 0) return 'bg-slate-100 text-slate-400 border-slate-200/50';
    if (score < 40) return 'bg-rose-100/80 text-rose-800 border-rose-200 hover:bg-rose-200';
    if (score < 70) return 'bg-amber-100/80 text-amber-800 border-amber-200 hover:bg-amber-200';
    if (score < 90) return 'bg-emerald-100/80 text-emerald-800 border-emerald-200 hover:bg-emerald-200';
    return 'bg-purple-100 text-purple-900 font-extrabold border-purple-300 hover:bg-purple-200';
  };

  const getTierLabel = (score: number) => {
    if (!score || score === 0) return 'Unassessed';
    if (score < 40) return 'Novice';
    if (score < 70) return 'Intermediate';
    if (score < 90) return 'Advanced';
    return 'Mastery';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
        <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-500">Generating organization capability heatmap matrix...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-32 max-w-7xl mx-auto">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-950 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-purple-200 flex items-center gap-1.5">
              <Hexagon className="w-3.5 h-3.5 text-purple-400" /> Enterprise Capability Intelligence
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Team Capability Matrix</h1>
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
            Multi-dimensional competency distribution matrix across your workforce. Track skill mastery, pinpoint capability deficits, and optimize talent allocation.
          </p>
        </div>

        <button
          onClick={fetchData}
          className="relative z-10 flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl backdrop-blur-md transition-colors self-start md:self-auto shrink-0"
        >
          <RefreshCw className="w-4 h-4" /> Recalculate Heatmap
        </button>

        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      </header>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Workforce</p>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-1">{data?.stats.totalLearners || 0} Members</p>
          <p className="text-[11px] text-slate-500 mt-1">{data?.stats.totalSkills || 0} trackable competencies</p>
        </div>

        <div className="bg-white border border-purple-200 bg-purple-50/20 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-purple-700">Team Avg Score</p>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-950 mt-1">{data?.stats.teamAverageScore || 0}%</p>
          <p className="text-[11px] text-purple-700 mt-1 font-semibold">Across all assessed skills</p>
        </div>

        <div className="bg-white border border-emerald-200 bg-emerald-50/20 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Top Team Strength</p>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-base font-bold text-emerald-950 mt-1 truncate">
            {data?.stats.topStrengths?.[0]?.name || 'High Density'}
          </p>
          <p className="text-[11px] text-emerald-700 mt-1 font-semibold">
            {data?.stats.topStrengths?.[0]?.averageScore || 85}% avg team proficiency
          </p>
        </div>

        <div className="bg-white border border-rose-200 bg-rose-50/20 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-rose-700">Critical Skill Gap</p>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-base font-bold text-rose-950 mt-1 truncate">
            {data?.stats.criticalGaps?.[0]?.name || 'Needs Training'}
          </p>
          <p className="text-[11px] text-rose-700 mt-1 font-semibold">
            {data?.stats.criticalGaps?.[0]?.averageScore || 35}% avg proficiency
          </p>
        </div>
      </div>

      {/* Filter and Legend Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by employee or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Heatmap Threshold Legend */}
        <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-4 text-slate-500 font-medium">
            <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">Proficiency Tiers:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-slate-200 inline-block" />
              <span className="text-[11px]">Unassessed (0%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-rose-200 inline-block" />
              <span className="text-[11px]">Novice (1-39%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-200 inline-block" />
              <span className="text-[11px]">Intermediate (40-69%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-200 inline-block" />
              <span className="text-[11px]">Advanced (70-89%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-purple-200 inline-block" />
              <span className="text-[11px]">Mastery (90-100%)</span>
            </div>
          </div>
          <span className="text-[11px] text-purple-700 font-bold hidden lg:inline">
            Click any cell to inspect competency evidence
          </span>
        </div>
      </div>

      {/* 2D Interactive Capability Heatmap Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto max-h-[600px]">
          <table className="w-full text-left border-collapse">
            {/* Header */}
            <thead className="bg-slate-50 sticky top-0 z-20 shadow-xs">
              <tr className="border-b border-slate-200">
                <th className="p-4 text-xs font-bold tracking-widest text-slate-500 uppercase min-w-[220px] sticky left-0 bg-slate-50 z-30 shadow-[2px_0_5px_rgba(0,0,0,0.03)]">
                  Team Member
                </th>
                <th className="p-4 text-xs font-bold tracking-widest text-slate-500 uppercase text-center min-w-[90px]">
                  Overall
                </th>
                {filteredSkills.map(skill => (
                  <th key={skill.id} className="p-3 text-center min-w-[130px]">
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-slate-800 truncate" title={skill.name}>
                        {skill.name}
                      </p>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-slate-200/70 text-slate-600">
                        {skill.category}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-slate-100">
              {filteredMatrix.length === 0 ? (
                <tr>
                  <td colSpan={filteredSkills.length + 2} className="p-12 text-center text-slate-500">
                    No team members match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredMatrix.map(row => (
                  <tr key={row.learner.id} className="hover:bg-purple-50/20 transition-colors">
                    {/* Sticky Learner Profile Info */}
                    <td className="p-4 sticky left-0 bg-white hover:bg-slate-50/90 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.03)] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                          {row.learner.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{row.learner.name}</p>
                          <p className="text-[10px] text-slate-500 truncate">{row.learner.currentRole}</p>
                        </div>
                      </div>
                    </td>

                    {/* Overall Score */}
                    <td className="p-3 text-center">
                      <span className="px-2.5 py-1 rounded-xl text-xs font-extrabold bg-purple-50 text-purple-700 border border-purple-200 inline-block">
                        {row.learner.overallScore}%
                      </span>
                    </td>

                    {/* Matrix Cells */}
                    {filteredSkills.map(skill => {
                      const skillData = row.skills[skill.id];
                      const score = skillData?.score || 0;
                      const hasData = !!skillData && score > 0;

                      return (
                        <td key={skill.id} className="p-2 text-center">
                          <button
                            onClick={() =>
                              setSelectedCell({
                                learnerName: row.learner.name,
                                skillName: skill.name,
                                category: skill.category,
                                score,
                                confidence: skillData?.confidence || 0,
                                evidenceCount: skillData?.evidenceCount || 0,
                                lastUpdated: skillData?.lastUpdated || null
                              })
                            }
                            className={`w-full py-2 px-1 rounded-xl text-xs font-bold border transition-all transform hover:scale-105 shadow-xs ${getHeatmapColor(
                              score
                            )}`}
                          >
                            {hasData ? `${score}%` : '—'}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Strategic Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Team Strengths */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-700">
            <Award className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-900">Highest Organizational Competency Strengths</h3>
          </div>
          <div className="space-y-3">
            {(data?.stats.topStrengths || []).map(str => (
              <div key={str.skillId} className="p-3.5 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-emerald-950">{str.name}</h4>
                  <p className="text-[10px] text-emerald-700 font-semibold uppercase">{str.category} • {str.masteredCount} members mastered</p>
                </div>
                <div className="text-right">
                  <span className="text-base font-extrabold text-emerald-600">{str.averageScore}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Deficits */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-rose-700">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-900">Critical Skill Vulnerability Areas</h3>
          </div>
          <div className="space-y-3">
            {(data?.stats.criticalGaps || []).map(gap => (
              <div key={gap.skillId} className="p-3.5 bg-rose-50/50 border border-rose-100 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-rose-950">{gap.name}</h4>
                  <p className="text-[10px] text-rose-700 font-semibold uppercase">{gap.category} • High training priority</p>
                </div>
                <div className="text-right">
                  <span className="text-base font-extrabold text-rose-600">{gap.averageScore}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cell Inspect Modal */}
      <AnimatePresence>
        {selectedCell && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full p-6 space-y-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800">
                    {selectedCell.category}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedCell.skillName}</h3>
                  <p className="text-xs text-slate-500">{selectedCell.learnerName}</p>
                </div>
                <button
                  onClick={() => setSelectedCell(null)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-center space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Assessed Proficiency</p>
                <p className="text-4xl font-extrabold text-purple-700">{selectedCell.score}%</p>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-white text-slate-700 border border-slate-200">
                  Tier: {getTierLabel(selectedCell.score)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Confidence</p>
                  <p className="text-sm font-bold text-slate-800">{selectedCell.confidence}%</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Evidence Count</p>
                  <p className="text-sm font-bold text-slate-800">{selectedCell.evidenceCount} records</p>
                </div>
              </div>

              {selectedCell.lastUpdated && (
                <p className="text-[11px] text-slate-400 text-center">
                  Last verified: {new Date(selectedCell.lastUpdated).toLocaleDateString()}
                </p>
              )}

              <button
                onClick={() => setSelectedCell(null)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
