import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Globe,
  FileText,
  Award,
  Sparkles,
  Sliders,
  MessageSquare,
  Search,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { assessmentApi } from '../../api/assessment.api';
import type { AssessmentItem, AssessmentSubmissionItem } from '../../api/assessment.api';

const GithubIcon: React.FC<{ size?: number; className?: string }> = ({ size = 14, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export const AssessmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [assessment, setAssessment] = useState<AssessmentItem | null>(null);
  const [submissions, setSubmissions] = useState<AssessmentSubmissionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'submissions' | 'overview' | 'competencies'>('submissions');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'GRADED' | 'REJECTED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Grading Modal State
  const [selectedSubmission, setSelectedSubmission] = useState<AssessmentSubmissionItem | null>(null);
  const [gradingScore, setGradingScore] = useState<number>(85);
  const [gradingFeedback, setGradingFeedback] = useState<string>('');
  const [gradingStatus, setGradingStatus] = useState<'GRADED' | 'REJECTED'>('GRADED');
  const [submittingGrade, setSubmittingGrade] = useState(false);
  const [gradeSuccessToast, setGradeSuccessToast] = useState<string | null>(null);

  const fetchAssessmentData = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const [assessmentData, submissionsData] = await Promise.all([
        assessmentApi.getById(id),
        assessmentApi.getSubmissions(id)
      ]);
      setAssessment(assessmentData);
      setSubmissions(submissionsData);
    } catch (err: any) {
      console.error('Error fetching assessment detail:', err);
      setError(err?.response?.data?.message || 'Failed to load assessment details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessmentData();
  }, [id]);

  const openGradingModal = (submission: AssessmentSubmissionItem) => {
    setSelectedSubmission(submission);
    setGradingScore(submission.score ?? Math.round((assessment?.maxScore || 100) * 0.85));
    setGradingFeedback(submission.feedback || '');
    setGradingStatus(submission.status === 'REJECTED' ? 'REJECTED' : 'GRADED');
  };

  const handleGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !selectedSubmission) return;

    setSubmittingGrade(true);
    try {
      const res = await assessmentApi.gradeSubmission(id, selectedSubmission.id, {
        score: Number(gradingScore),
        feedback: gradingFeedback.trim(),
        status: gradingStatus
      });

      // Update local submissions list
      setSubmissions(prev =>
        prev.map(sub => (sub.id === selectedSubmission.id ? res.submission : sub))
      );

      setGradeSuccessToast(res.message || 'Submission graded & Competency DNA recalculated!');
      setSelectedSubmission(null);
      setTimeout(() => {
        setGradeSuccessToast(null);
      }, 3500);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to submit grade.');
    } finally {
      setSubmittingGrade(false);
    }
  };

  const filteredSubmissions = submissions.filter(sub => {
    const matchesStatus = statusFilter === 'ALL' || sub.status === statusFilter;
    const matchesSearch =
      (sub.user?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sub.user?.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sub.notes || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pendingCount = submissions.filter(s => s.status === 'PENDING').length;
  const gradedCount = submissions.filter(s => s.status === 'GRADED').length;
  const averageScore = gradedCount > 0
    ? Math.round(
        submissions
          .filter(s => s.status === 'GRADED' && s.score != null)
          .reduce((acc, curr) => acc + (curr.score || 0), 0) / gradedCount
      )
    : 0;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-500">Loading assessment evaluation workspace...</p>
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center space-y-4">
        <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl inline-block">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Assessment Not Found</h2>
        <p className="text-sm text-slate-500">{error || 'Could not load requested assessment workspace.'}</p>
        <Link
          to="/trainer/assessments"
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Assessments
        </Link>
      </div>
    );
  }

  const courseTitle = typeof assessment.courseId === 'object' && assessment.courseId?.title
    ? assessment.courseId.title
    : (assessment.course?.title || 'Course Module');

  const targetCompetencies = assessment.course?.targetCompetencies || ['Full-Stack Engineering', 'API Design'];

  return (
    <div className="space-y-6 pb-32 max-w-7xl mx-auto">
      {/* Toast */}
      <AnimatePresence>
        {gradeSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-xl border border-purple-500/30 flex items-center gap-3"
          >
            <Sparkles className="w-5 h-5 text-purple-400" />
            <p className="text-xs font-semibold">{gradeSuccessToast}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back link */}
      <div className="flex items-center justify-between">
        <Link
          to="/trainer/assessments"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Assessments
        </Link>
        <button
          onClick={fetchAssessmentData}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Header Banner */}
      <header className="bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-950 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-purple-200">
              {courseTitle}
            </span>
            <span className="px-3 py-1 bg-purple-500/20 rounded-full text-xs font-bold uppercase tracking-wider text-purple-300">
              {assessment.type || 'Project'} Assessment
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mt-2 mb-3">{assessment.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-purple-200 font-medium">
            <span>Max Score: <strong className="text-white">{assessment.maxScore || 100} pts</strong></span>
            <span>•</span>
            <span>Target Competencies: <strong className="text-white">{targetCompetencies.join(', ')}</strong></span>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      </header>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Submissions</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{submissions.length}</p>
        </div>
        <div className="bg-white border border-amber-200 bg-amber-50/20 rounded-2xl p-5 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Pending Grading
          </p>
          <p className="text-2xl font-bold text-amber-900 mt-1">{pendingCount}</p>
        </div>
        <div className="bg-white border border-emerald-200 bg-emerald-50/20 rounded-2xl p-5 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Graded & Verified
          </p>
          <p className="text-2xl font-bold text-emerald-900 mt-1">{gradedCount}</p>
        </div>
        <div className="bg-white border border-purple-200 bg-purple-50/20 rounded-2xl p-5 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-purple-700 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5" /> Average Score
          </p>
          <p className="text-2xl font-bold text-purple-900 mt-1">
            {averageScore > 0 ? `${averageScore}/${assessment.maxScore || 100}` : '—'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setActiveTab('submissions')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'submissions'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          Submissions & Grading
          {pendingCount > 0 && (
            <span className="px-2 py-0.5 text-[10px] bg-amber-100 text-amber-800 font-bold rounded-full">
              {pendingCount} new
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Sliders className="w-4 h-4" /> Assessment Specs & Rubric
        </button>
        <button
          onClick={() => setActiveTab('competencies')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'competencies'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4" /> Competency DNA Matrix
        </button>
      </div>

      {/* Tab 1: Submissions & Grading */}
      {activeTab === 'submissions' && (
        <div className="space-y-4">
          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search learner name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {(['ALL', 'PENDING', 'GRADED', 'REJECTED'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    statusFilter === status
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Submissions List */}
          {filteredSubmissions.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 space-y-3">
              <FileText className="w-10 h-10 mx-auto text-slate-300" />
              <p className="font-semibold text-slate-700">No submissions found</p>
              <p className="text-xs text-slate-400">
                {submissions.length === 0
                  ? 'Learners enrolled in this course have not submitted their work yet.'
                  : 'No submissions match your current filters.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredSubmissions.map(submission => (
                <motion.div
                  key={submission.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-purple-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Learner Info */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 text-white font-bold flex items-center justify-center text-base shadow-sm shrink-0">
                      {submission.user?.name?.charAt(0) || 'L'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-sm">{submission.user?.name || 'Unknown Learner'}</h3>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            submission.status === 'GRADED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : submission.status === 'REJECTED'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {submission.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{submission.user?.email}</p>
                      {submission.user?.targetRole && (
                        <p className="text-[11px] text-purple-700 font-semibold mt-1">
                          Target Role: {submission.user.targetRole}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Submission Links & Notes */}
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    {submission.githubUrl && (
                      <a
                        href={submission.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-medium transition-colors"
                      >
                        <GithubIcon size={14} className="text-slate-900" /> Repository
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    )}
                    {submission.demoUrl && (
                      <a
                        href={submission.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-medium transition-colors"
                      >
                        <Globe className="w-3.5 h-3.5 text-indigo-600" /> Live Demo
                        <ExternalLink className="w-3 h-3 text-indigo-400" />
                      </a>
                    )}
                    {submission.notes && (
                      <span
                        title={submission.notes}
                        className="flex items-center gap-1 text-slate-500 max-w-xs truncate cursor-help"
                      >
                        <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                        {submission.notes}
                      </span>
                    )}
                  </div>

                  {/* Score & Action */}
                  <div className="flex items-center gap-4 justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0">
                    {submission.status === 'GRADED' && (
                      <div className="text-right">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Score</p>
                        <p className="text-base font-extrabold text-emerald-600">
                          {submission.score} / {assessment.maxScore || 100}
                        </p>
                      </div>
                    )}
                    <button
                      onClick={() => openGradingModal(submission)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 ${
                        submission.status === 'PENDING'
                          ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/20'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      {submission.status === 'PENDING' ? 'Grade Rubric' : 'Edit Evaluation'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Overview & Rubric Specs */}
      {activeTab === 'overview' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Assessment Overview & Requirements</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              This practical project evaluates the learner's hands-on architectural design, coding standards, and deployment execution for {courseTitle}.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Architecture & Clean Code</h4>
              <p className="text-xs text-slate-600">40% of grade — Proper project organization, separation of concerns, and clean commit history.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Functional Requirements</h4>
              <p className="text-xs text-slate-600">40% of grade — Full implementation of core features, error handling, and validation.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Live Deployment & Documentation</h4>
              <p className="text-xs text-slate-600">20% of grade — Accessible live deployment URL and descriptive README notes.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Competency DNA Matrix */}
      {activeTab === 'competencies' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">Automated Competency DNA Synchronization</h2>
            <p className="text-sm text-slate-600">
              When a trainer grades and passes a learner's assessment, verified Competency Evidence records are automatically produced, lifting these competencies across the learner's radar:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {targetCompetencies.map(comp => (
              <div key={comp} className="p-4 bg-purple-50/50 border border-purple-100 rounded-2xl flex items-center gap-3">
                <div className="p-2.5 bg-purple-600 text-white rounded-xl shadow-sm">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-purple-950">{comp}</h4>
                  <p className="text-[11px] text-purple-700 font-medium">+1.5x Evidence Weight on Grade</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grading Rubric Modal */}
      <AnimatePresence>
        {selectedSubmission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-2xl w-full overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 p-6 text-white flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 text-purple-200 text-xs font-semibold uppercase tracking-wider mb-1">
                    <Sliders className="w-4 h-4" /> Live Rubric Evaluation
                  </div>
                  <h2 className="text-xl font-bold">{selectedSubmission.user?.name || 'Learner Submission'}</h2>
                  <p className="text-purple-100 text-xs mt-0.5">{selectedSubmission.user?.email}</p>
                </div>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleGradeSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
                {/* Submission Artifacts Preview */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Submitted Artifacts</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSubmission.githubUrl ? (
                      <a
                        href={selectedSubmission.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 hover:border-purple-400 transition-colors"
                      >
                        <GithubIcon size={14} /> Open GitHub Repo <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400 italic">No GitHub URL provided</span>
                    )}

                    {selectedSubmission.demoUrl && (
                      <a
                        href={selectedSubmission.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-xl text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-colors"
                      >
                        <Globe className="w-3.5 h-3.5 text-indigo-600" /> View Live Demo <ExternalLink className="w-3 h-3 text-indigo-400" />
                      </a>
                    )}
                  </div>

                  {selectedSubmission.notes && (
                    <div className="pt-2 border-t border-slate-200/60">
                      <p className="text-[11px] font-bold uppercase text-slate-400 mb-1">Architecture Notes:</p>
                      <p className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-100 whitespace-pre-wrap">
                        {selectedSubmission.notes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Score Slider & Input */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Evaluation Score
                    </label>
                    <span className="text-sm font-extrabold text-purple-700">
                      {gradingScore} / {assessment.maxScore || 100} pts ({Math.round((gradingScore / (assessment.maxScore || 100)) * 100)}%)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={assessment.maxScore || 100}
                    value={gradingScore}
                    onChange={(e) => setGradingScore(Number(e.target.value))}
                    className="w-full accent-purple-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1">
                    <span>0 (Fail)</span>
                    <span>50 (Pass Threshold)</span>
                    <span>{assessment.maxScore || 100} (Mastery)</span>
                  </div>
                </div>

                {/* Evaluation Status Toggle */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Grading Verdict
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setGradingStatus('GRADED')}
                      className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                        gradingStatus === 'GRADED'
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-800 shadow-sm'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Approve & Credit Skills
                    </button>
                    <button
                      type="button"
                      onClick={() => setGradingStatus('REJECTED')}
                      className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                        gradingStatus === 'REJECTED'
                          ? 'bg-rose-50 border-rose-400 text-rose-800 shadow-sm'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <XCircle className="w-4 h-4 text-rose-600" />
                      Request Revisions
                    </button>
                  </div>
                </div>

                {/* Trainer Feedback Comments */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Trainer Feedback & Actionable Guidance
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Provide constructive feedback on what the learner did well and specific areas to optimize..."
                    value={gradingFeedback}
                    onChange={(e) => setGradingFeedback(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 placeholder:text-slate-400 resize-none"
                  />
                </div>

                {/* Real-time DNA impact preview notice */}
                {gradingStatus === 'GRADED' && (
                  <div className="bg-purple-50 border border-purple-100 rounded-xl p-3 flex items-start gap-2 text-xs text-purple-900">
                    <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      Approving this submission will immediately record evidence for <strong>{targetCompetencies.join(', ')}</strong> and trigger real-time recalculation of the learner's Competency DNA Radar and Readiness score!
                    </div>
                  </div>
                )}

                {/* Footer Actions */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedSubmission(null)}
                    className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingGrade}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-500/20 hover:shadow-purple-500/30 transition-all disabled:opacity-50"
                  >
                    {submittingGrade ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving & Updating DNA...
                      </>
                    ) : (
                      <>
                        <Award className="w-4 h-4" /> Complete Evaluation
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
