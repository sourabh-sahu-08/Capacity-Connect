import { useState, useEffect } from 'react';
import {
  Compass,
  Users,
  Target,
  Sparkles,
  CheckCircle2,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Zap,
  TrendingUp,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { managerApi } from '../../api/manager.api';
import type {
  RoleRequirementItem,
  TalentMobilityResponse,
  WorkforceReadinessItem
} from '../../api/manager.api';

export const ReadinessPlanning = () => {
  const [roles, setRoles] = useState<RoleRequirementItem[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [simulationData, setSimulationData] = useState<TalentMobilityResponse | null>(null);
  const [workforceReadiness, setWorkforceReadiness] = useState<WorkforceReadinessItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [expandedCandidateId, setExpandedCandidateId] = useState<string | null>(null);
  const [minThreshold] = useState<number>(0);
  const [candidateFilter, setCandidateFilter] = useState<'ALL' | 'READY_NOW' | 'UPSKILLING_REQUIRED' | 'HIGH_GAP'>('ALL');

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [rolesList, readinessList] = await Promise.all([
        managerApi.getRoles(),
        managerApi.getWorkforceReadiness()
      ]);
      setRoles(rolesList);
      setWorkforceReadiness(readinessList);

      if (rolesList.length > 0) {
        setSelectedRoleId(rolesList[0].id);
        runSimulation(rolesList[0].id, 0);
      }
    } catch (err) {
      console.error('Failed to load readiness data:', err);
    } finally {
      setLoading(false);
    }
  };

  const runSimulation = async (roleId: string, threshold = minThreshold) => {
    if (!roleId) return;
    setSimulating(true);
    try {
      const res = await managerApi.simulateMobility(roleId, threshold);
      setSimulationData(res);
      if (res.candidates.length > 0) {
        setExpandedCandidateId(res.candidates[0].candidate.id);
      }
    } catch (err) {
      console.error('Mobility simulation error:', err);
    } finally {
      setSimulating(false);
    }
  };

  const handleRoleChange = (newRoleId: string) => {
    setSelectedRoleId(newRoleId);
    runSimulation(newRoleId, minThreshold);
  };

  const filteredCandidates = (simulationData?.candidates || []).filter(c => {
    if (candidateFilter === 'ALL') return true;
    return c.fitCategory === candidateFilter;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
        <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-500">Loading Talent Mobility & Role Gap Simulator...</p>
      </div>
    );
  }

  const selectedRole = roles.find(r => r.id === selectedRoleId);

  return (
    <div className="space-y-8 pb-32 max-w-7xl mx-auto">
      {/* Header Banner */}
      <header className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white rounded-3xl p-8 md:p-10 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-purple-200 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-purple-400" /> Talent Mobility Simulator
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Workforce Readiness & Role Gap Engine</h1>
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
            Simulate internal talent mobility scenarios, evaluate candidate bench strength against critical job benchmarks, and deploy targeted upskilling prescriptions.
          </p>
        </div>
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      </header>

      {/* Target Role Selector & Simulator Control Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-purple-600" /> Select Target Benchmark Role to Simulate
            </label>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {roles.map(role => (
                <button
                  key={role.id}
                  onClick={() => handleRoleChange(role.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                    selectedRoleId === role.id
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
                  }`}
                >
                  <span>{role.roleName}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${selectedRoleId === role.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    {role.skills.length} skills
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => runSimulation(selectedRoleId, minThreshold)}
            disabled={simulating}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold rounded-2xl shadow-md shadow-purple-500/20 transition-all shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${simulating ? 'animate-spin' : ''}`} />
            {simulating ? 'Simulating Mobility...' : 'Re-Run Simulation'}
          </button>
        </div>
      </div>

      {/* Simulation Bench Summary Cards */}
      {simulationData && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Evaluated</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{simulationData.benchSummary.totalCandidates}</p>
            <p className="text-[11px] text-slate-500 mt-1">Pool candidates</p>
          </div>

          <div className="bg-white border border-emerald-200 bg-emerald-50/20 rounded-2xl p-5 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Ready Now (≥80%)
            </p>
            <p className="text-2xl font-bold text-emerald-950 mt-1">{simulationData.benchSummary.readyNowCount}</p>
            <p className="text-[11px] text-emerald-700 mt-1 font-semibold">Immediate transition ready</p>
          </div>

          <div className="bg-white border border-amber-200 bg-amber-50/20 rounded-2xl p-5 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> In Pipeline (60-79%)
            </p>
            <p className="text-2xl font-bold text-amber-950 mt-1">{simulationData.benchSummary.upskillingCount}</p>
            <p className="text-[11px] text-amber-700 mt-1 font-semibold">Ready in 30-60 days</p>
          </div>

          <div className="bg-white border border-purple-200 bg-purple-50/20 rounded-2xl p-5 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-purple-700 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" /> Bench Avg Match
            </p>
            <p className="text-2xl font-bold text-purple-950 mt-1">{simulationData.benchSummary.averageReadiness}%</p>
            <p className="text-[11px] text-purple-700 mt-1 font-semibold">Average candidate match</p>
          </div>
        </div>
      )}

      {/* Candidate Pipeline & Gap Breakdown Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Ranked Candidate Mobility Pipeline ({filteredCandidates.length})
          </h2>

          <div className="flex items-center gap-2">
            {(['ALL', 'READY_NOW', 'UPSKILLING_REQUIRED', 'HIGH_GAP'] as const).map(tier => (
              <button
                key={tier}
                onClick={() => setCandidateFilter(tier)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                  candidateFilter === tier
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tier.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Candidate Cards */}
        {filteredCandidates.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500 space-y-3">
            <Users className="w-10 h-10 mx-auto text-slate-300" />
            <p className="font-semibold text-slate-700">No candidates match current filter.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCandidates.map((candidateObj, index) => {
              const isExpanded = expandedCandidateId === candidateObj.candidate.id;
              const isReady = candidateObj.fitCategory === 'READY_NOW';
              const isUpskill = candidateObj.fitCategory === 'UPSKILLING_REQUIRED';

              return (
                <motion.div
                  key={candidateObj.candidate.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:border-purple-200 transition-all"
                >
                  {/* Candidate Header Summary */}
                  <div
                    onClick={() => setExpandedCandidateId(isExpanded ? null : candidateObj.candidate.id)}
                    className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-7 h-7 rounded-full bg-slate-100 font-bold text-xs flex items-center justify-center text-slate-600 shrink-0">
                        #{index + 1}
                      </div>

                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold flex items-center justify-center text-base shadow-sm shrink-0">
                        {candidateObj.candidate.name.charAt(0)}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-sm md:text-base">
                            {candidateObj.candidate.name}
                          </h3>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              isReady
                                ? 'bg-emerald-100 text-emerald-800'
                                : isUpskill
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {candidateObj.fitCategory.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Current Role: {candidateObj.candidate.currentRole} • Overall Proficiency: {candidateObj.candidate.overallScore}%
                        </p>
                      </div>
                    </div>

                    {/* Score Gauge & Action */}
                    <div className="flex items-center gap-6 justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0">
                      <div className="text-right">
                        <p className="text-[10px] font-bold uppercase text-slate-400">Match Readiness</p>
                        <p
                          className={`text-2xl font-extrabold ${
                            isReady
                              ? 'text-emerald-600'
                              : isUpskill
                              ? 'text-amber-600'
                              : 'text-rose-600'
                          }`}
                        >
                          {candidateObj.readinessScore}%
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-slate-400">
                        <span className="text-xs font-semibold text-purple-600 hidden sm:inline">
                          {isExpanded ? 'Hide Gaps' : 'Inspect Gaps & Upskilling'}
                        </span>
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Skill Gaps & Action Plan Accordion */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-slate-100 bg-slate-50/50 p-6 space-y-6"
                      >
                        {/* Skill Gaps Breakdown */}
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-purple-600" />
                            Competency Gap Analysis for {selectedRole?.roleName}
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {candidateObj.skillGaps.map(gap => (
                              <div
                                key={gap.skillId}
                                className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-slate-900">{gap.skillName}</span>
                                  <span
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                      gap.isMet
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : gap.priority === 'CRITICAL'
                                        ? 'bg-rose-50 text-rose-700'
                                        : 'bg-amber-50 text-amber-700'
                                    }`}
                                  >
                                    {gap.isMet ? 'Benchmark Met ✓' : `Gap: -${gap.gap}%`}
                                  </span>
                                </div>

                                <div className="space-y-1">
                                  <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                                    <span>Current: {gap.currentScore}%</span>
                                    <span>Target: {gap.requiredLevel}%</span>
                                  </div>
                                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden relative">
                                    <div
                                      className={`h-2 rounded-full transition-all ${
                                        gap.isMet ? 'bg-emerald-500' : 'bg-amber-500'
                                      }`}
                                      style={{ width: `${Math.min(100, gap.currentScore)}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Targeted Upskilling Prescription */}
                        {candidateObj.recommendedCourses.length > 0 && (
                          <div className="bg-purple-50/80 border border-purple-200/80 rounded-2xl p-5 space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-950 flex items-center gap-1.5">
                                <BookOpen className="w-4 h-4 text-purple-700" />
                                Recommended Upskilling Path (Estimated ~{candidateObj.estimatedUpskillWeeks} weeks)
                              </h4>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {candidateObj.recommendedCourses.map(c => (
                                <div key={c.id} className="bg-white p-3.5 rounded-xl border border-purple-100 shadow-xs">
                                  <p className="text-xs font-bold text-slate-900">{c.title}</p>
                                  <p className="text-[10px] text-purple-700 font-semibold mt-1">
                                    Targets: {c.targetCompetencies.join(', ')}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Workforce-Wide Role Readiness Matrix */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-sm">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          <div>
            <h3 className="text-base font-bold text-slate-900">Organizational Benchmark Role Health Matrix</h3>
            <p className="text-xs text-slate-500">
              Overview of internal talent bench readiness across all critical technical functions:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workforceReadiness.map(item => (
            <div
              key={item.roleId}
              className={`p-5 rounded-2xl border transition-all ${
                item.healthStatus === 'HEALTHY'
                  ? 'bg-emerald-50/40 border-emerald-200'
                  : item.healthStatus === 'WATCH'
                  ? 'bg-amber-50/40 border-amber-200'
                  : 'bg-rose-50/40 border-rose-200'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{item.roleName}</h4>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase mt-1 inline-block ${
                      item.healthStatus === 'HEALTHY'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.healthStatus === 'WATCH'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {item.healthStatus}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Avg Match</p>
                  <p className="text-base font-extrabold text-slate-900">{item.averageReadiness}%</p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200/60">
                <div className="flex justify-between">
                  <span>Ready Now (≥80%):</span>
                  <strong className="text-emerald-700">{item.readyHeadcount} engineers</strong>
                </div>
                <div className="flex justify-between">
                  <span>In Pipeline (60-79%):</span>
                  <strong className="text-amber-700">{item.pipelineHeadcount} engineers</strong>
                </div>
                <div className="flex justify-between">
                  <span>Target Benchmark:</span>
                  <strong>{item.targetHeadcount} needed</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
