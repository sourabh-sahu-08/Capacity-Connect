// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  UserPlus, 
  UserCheck, 
  Building, 
  Briefcase, 
  MapPin, 
  Globe, 
  Calendar, 
  Award, 
  Brain, 
  BookOpen, 
  Share2, 
  Edit3, 
  Sparkles, 
  ShieldCheck, 
  Target, 
  CheckCircle2, 
  ArrowLeft,
  Users,
  Trophy,
  ExternalLink,
  FolderGit2,
  Plus,
  Star,
  Layers,
  Quote,
  MessageSquareQuote,
  Trash2,
  Check,
  XCircle
} from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { userApi } from '../../api/user.api';
import type { PublicUserProfile, UserSummary, UserProject, Recommendation } from '../../api/user.api';
import { useAuthStore } from '../../store/authStore';
import { FollowListModal } from './FollowListModal';
import { ActivityHeatmap } from './ActivityHeatmap';
import { ProjectModal } from './ProjectModal';
import { RecommendationModal } from './RecommendationModal';
import { AppShell } from '../../components/layout/AppShell';
import { TrainerLayout } from '../../layouts/TrainerLayout';
import { ManagerLayout } from '../../layouts/ManagerLayout';

const GithubIcon: React.FC<{ size?: number; className?: string }> = ({ size = 14, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export const PublicProfileView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);

  const [profile, setProfile] = useState<PublicUserProfile | null>(null);
  const [projects, setProjects] = useState<UserProject[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [pendingRecommendations, setPendingRecommendations] = useState<Recommendation[]>([]);
  const [isSelf, setIsSelf] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'recommendations' | 'competency' | 'courses' | 'achievements'>('overview');

  // Endorsements state
  const [endorsements, setEndorsements] = useState<Record<string, any>>({});
  const [endorseLoading, setEndorseLoading] = useState<Record<string, boolean>>({});

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'followers' | 'following'>('followers');
  const [modalUsers, setModalUsers] = useState<UserSummary[]>([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Project Modal states
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<UserProject | null>(null);

  // Recommendation Modal states
  const [recommendationModalOpen, setRecommendationModalOpen] = useState(false);
  const [respondingRecId, setRespondingRecId] = useState<string | null>(null);

  const targetId = id || currentUser?.id;

  useEffect(() => {
    if (!targetId) return;

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const [res, recRes] = await Promise.all([
          userApi.getProfile(targetId),
          userApi.getRecommendations(targetId).catch(() => ({ data: { recommendations: [], pendingRecommendations: [] } }))
        ]);

        setProfile(res.data.user);
        setProjects(res.data.user.projects || []);
        setIsSelf(res.data.isSelf);
        setIsFollowing(res.data.isFollowing);
        setEndorsements(res.data.endorsements || {});
        setFollowersCount(res.data.stats.followersCount || 0);
        setFollowingCount(res.data.stats.followingCount || 0);

        if (recRes?.data) {
          setRecommendations(recRes.data.recommendations || []);
          setPendingRecommendations(recRes.data.pendingRecommendations || []);
        }
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [targetId, currentUser?.id]);

  const handleRespondRecommendation = async (recId: string, status: 'ACCEPTED' | 'REJECTED') => {
    setRespondingRecId(recId);
    try {
      const res = await userApi.respondRecommendation(recId, status);
      if (status === 'ACCEPTED') {
        setPendingRecommendations((prev) => prev.filter((r) => r.id !== recId));
        setRecommendations((prev) => [res.data.recommendation, ...prev]);
      } else {
        setPendingRecommendations((prev) => prev.filter((r) => r.id !== recId));
      }
    } catch (err) {
      console.error('Failed to respond to recommendation', err);
    } finally {
      setRespondingRecId(null);
    }
  };

  const handleDeleteRecommendation = async (recId: string) => {
    if (!window.confirm('Are you sure you want to remove this recommendation?')) return;
    try {
      await userApi.deleteRecommendation(recId);
      setRecommendations((prev) => prev.filter((r) => r.id !== recId));
      setPendingRecommendations((prev) => prev.filter((r) => r.id !== recId));
    } catch (err) {
      console.error('Failed to delete recommendation', err);
    }
  };

  const handleRecommendationSuccess = (newRec: Recommendation) => {
    // If self, might be in pending, or let user know it was sent
    alert('Thank you! Your recommendation has been submitted for review.');
  };

  const handleOpenAddProject = () => {
    setSelectedProject(null);
    setProjectModalOpen(true);
  };

  const handleOpenEditProject = (p: UserProject) => {
    setSelectedProject(p);
    setProjectModalOpen(true);
  };

  const handleProjectSuccess = (savedProject: UserProject, isEdit: boolean) => {
    if (isEdit) {
      setProjects((prev) => prev.map((p) => (p.id === savedProject.id ? savedProject : p)));
    } else {
      setProjects((prev) => [savedProject, ...prev]);
    }
  };

  const handleProjectDelete = (projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
  };

  const handleToggleFollow = async () => {
    if (!profile || isSelf) return;
    setFollowLoading(true);
    try {
      const res = await userApi.toggleFollow(profile.id);
      setIsFollowing(res.data.isFollowing);
      setFollowersCount(res.data.followersCount);
    } catch (err) {
      console.error('Follow toggle failed', err);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleToggleEndorse = async (skillName: string) => {
    if (!profile || isSelf) return;
    setEndorseLoading((prev) => ({ ...prev, [skillName]: true }));

    try {
      const res = await userApi.toggleEndorse(profile.id, skillName);
      setEndorsements((prev) => {
        const current = prev[skillName] || { count: 0, hasEndorsed: false, endorsers: [] };
        return {
          ...prev,
          [skillName]: {
            count: res.data.count,
            hasEndorsed: res.data.endorsed,
            endorsers: res.data.endorsed
              ? [
                  ...(currentUser ? [{ id: currentUser.id, name: currentUser.name, avatar: currentUser.avatar, role: currentUser.role }] : []),
                  ...current.endorsers.filter((e: any) => e.id !== currentUser?.id),
                ].slice(0, 5)
              : current.endorsers.filter((e: any) => e.id !== currentUser?.id),
          },
        };
      });
    } catch (err) {
      console.error('Failed to toggle endorsement', err);
    } finally {
      setEndorseLoading((prev) => ({ ...prev, [skillName]: false }));
    }
  };

  const handleOpenFollowModal = async (type: 'followers' | 'following') => {
    if (!profile) return;
    setModalType(type);
    setModalOpen(true);
    setModalLoading(true);
    try {
      if (type === 'followers') {
        const res = await userApi.getFollowers(profile.id);
        setModalUsers(res.data.followers);
      } else {
        const res = await userApi.getFollowing(profile.id);
        setModalUsers(res.data.following);
      }
    } catch (err) {
      console.error(`Failed to fetch ${type}`, err);
    } finally {
      setModalLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
          <p className="text-xs font-semibold text-slate-500">Loading user profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">User Not Found</h2>
        <p className="mt-2 text-xs text-slate-500">The profile you are looking for does not exist or was removed.</p>
        <button
          onClick={() => navigate('/network')}
          className="mt-5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-purple-700"
        >
          Discover Other Learners
        </button>
      </div>
    );
  }

  const radarData = profile.competencyProfile
    ? [
        { subject: 'Technical', A: profile.competencyProfile.dnaTechnical || 80, fullMark: 100 },
        { subject: 'Analytical', A: profile.competencyProfile.dnaAnalytical || 75, fullMark: 100 },
        { subject: 'Communication', A: profile.competencyProfile.dnaCommunication || 70, fullMark: 100 },
        { subject: 'Leadership', A: profile.competencyProfile.dnaLeadership || 65, fullMark: 100 },
        { subject: 'Creativity', A: profile.competencyProfile.dnaCreativity || 85, fullMark: 100 },
      ]
    : [];

  const roleBadgeStyle = 
    profile.role === 'ADMIN' ? 'bg-rose-50 text-rose-600 border-rose-200' :
    profile.role === 'MANAGER' ? 'bg-amber-50 text-amber-600 border-amber-200' :
    profile.role === 'TRAINER' ? 'bg-indigo-50 text-indigo-600 border-indigo-200' :
    'bg-purple-50 text-purple-600 border-purple-200';

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-20 text-slate-800">
      {/* Top back nav */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
        >
          <Share2 size={14} className="text-purple-600" />
          {copiedLink ? 'Link Copied!' : 'Share Profile'}
        </button>
      </div>

      {/* Hero Banner Card */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
        {/* Banner Cover Backdrop */}
        <div className="h-44 w-full bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2),transparent_70%)]" />
          <div className="absolute -right-10 -bottom-10 h-56 w-56 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute left-10 top-5 h-32 w-32 rounded-full bg-purple-400/20 blur-xl pointer-events-none" />
        </div>

        {/* Profile Details Header */}
        <div className="relative px-6 pb-6 pt-0 md:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-5 -mt-16 md:-mt-20">
            {/* Avatar & Basic Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
              <div className="relative h-28 w-28 md:h-32 md:w-32 rounded-2xl border-4 border-white bg-purple-100 text-purple-700 font-bold text-3xl flex items-center justify-center overflow-hidden shadow-xl">
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.name} className="h-full w-full object-cover" />
                ) : (
                  profile.name?.charAt(0).toUpperCase() || 'U'
                )}
              </div>

              <div className="mb-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">{profile.name}</h1>
                  <span className={`rounded-lg border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${roleBadgeStyle}`}>
                    {profile.role}
                  </span>
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
                  {profile.currentRole && (
                    <span className="flex items-center gap-1">
                      <Briefcase size={14} className="text-purple-600" />
                      {profile.currentRole}
                    </span>
                  )}
                  {profile.organization && (
                    <span className="flex items-center gap-1">
                      <Building size={14} className="text-slate-400" />
                      {profile.organization}
                    </span>
                  )}
                  {profile.location && (
                    <span className="flex items-center gap-1">
                      <MapPin size={14} className="text-rose-500" />
                      {profile.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar size={14} className="text-slate-400" />
                    Joined {new Date(profile.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 w-full sm:w-auto mt-2 md:mt-0">
              {isSelf ? (
                <button
                  onClick={() => navigate('/profile')}
                  className="flex flex-1 sm:flex-initial items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-purple-700 transition-all"
                >
                  <Edit3 size={15} />
                  Edit My Profile
                </button>
              ) : (
                <button
                  onClick={handleToggleFollow}
                  disabled={followLoading}
                  className={`flex flex-1 sm:flex-initial items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold shadow-md transition-all ${
                    isFollowing
                      ? 'border border-slate-200 bg-white text-slate-700 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >
                  {followLoading ? (
                    <span className="animate-spin text-xs">⏳</span>
                  ) : isFollowing ? (
                    <>
                      <UserCheck size={16} />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} />
                      Follow
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Followers, Following, and Socials Strip */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5">
            {/* Social Network Counters */}
            <div className="flex items-center gap-6">
              <button
                onClick={() => handleOpenFollowModal('followers')}
                className="group flex items-center gap-2 text-left"
              >
                <span className="text-lg font-extrabold text-slate-900 group-hover:text-purple-600 transition-colors">
                  {followersCount}
                </span>
                <span className="text-xs font-medium text-slate-500 group-hover:text-purple-600 transition-colors">
                  Followers
                </span>
              </button>

              <button
                onClick={() => handleOpenFollowModal('following')}
                className="group flex items-center gap-2 text-left"
              >
                <span className="text-lg font-extrabold text-slate-900 group-hover:text-purple-600 transition-colors">
                  {followingCount}
                </span>
                <span className="text-xs font-medium text-slate-500 group-hover:text-purple-600 transition-colors">
                  Following
                </span>
              </button>

              {profile.competencyProfile && (
                <div className="flex items-center gap-2 border-l border-slate-200 pl-6">
                  <span className="text-lg font-extrabold text-purple-600">
                    {Math.round(profile.competencyProfile.readinessScore || profile.competencyProfile.overallScore || 0)}%
                  </span>
                  <span className="text-xs font-medium text-slate-500">Readiness Score</span>
                </div>
              )}
            </div>

            {/* Social Profile Links */}
            <div className="flex items-center gap-2">
              {profile.githubUrl && (
                <a
                  href={profile.githubUrl.startsWith('http') ? profile.githubUrl : `https://${profile.githubUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700 transition-all"
                  title="GitHub Profile"
                >
                  <span className="font-bold text-xs">GH</span>
                </a>
              )}
              {profile.linkedinUrl && (
                <a
                  href={profile.linkedinUrl.startsWith('http') ? profile.linkedinUrl : `https://${profile.linkedinUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all"
                  title="LinkedIn Profile"
                >
                  <span className="font-bold text-xs">in</span>
                </a>
              )}
              {profile.twitterUrl && (
                <a
                  href={profile.twitterUrl.startsWith('http') ? profile.twitterUrl : `https://${profile.twitterUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-sky-500 hover:border-sky-300 hover:bg-sky-50 transition-all"
                  title="Twitter / X"
                >
                  <span className="font-bold text-xs">𝕏</span>
                </a>
              )}
              {profile.websiteUrl && (
                <a
                  href={profile.websiteUrl.startsWith('http') ? profile.websiteUrl : `https://${profile.websiteUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700 transition-all"
                  title="Personal Website"
                >
                  <Globe size={15} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Sparkles size={15} /> Overview & Goals
        </button>

        <button
          onClick={() => setActiveTab('projects')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'projects'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <FolderGit2 size={15} /> Projects & Portfolio ({projects.length})
        </button>

        <button
          onClick={() => setActiveTab('recommendations')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'recommendations'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Quote size={15} /> Recommendations ({recommendations.length})
          {isSelf && pendingRecommendations.length > 0 && (
            <span className="rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] text-white font-extrabold shadow-xs">
              {pendingRecommendations.length} new
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('competency')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'competency'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Brain size={15} /> Competency & DNA
        </button>

        {profile.role === 'TRAINER' && (
          <button
            onClick={() => setActiveTab('courses')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'courses'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <BookOpen size={15} /> Authored Courses ({profile.courses?.length || 0})
          </button>
        )}

        <button
          onClick={() => setActiveTab('achievements')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'achievements'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Trophy size={15} /> Badges & Credentials
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Bio Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900">About</h3>
              <p className="mt-3 text-xs leading-relaxed text-slate-600 whitespace-pre-line">
                {profile.bio || 'No biography written yet.'}
              </p>
            </div>

            {/* Target Role & Career Path */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900">Career Trajectory</h3>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-purple-100 bg-purple-50/50 p-4">
                  <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Target Goal Role</span>
                  <p className="mt-1 text-sm font-bold text-slate-900">{profile.targetRole || 'Not specified'}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Experience Level</span>
                  <p className="mt-1 text-sm font-bold text-slate-900">{profile.experienceLevel || 'Intermediate'}</p>
                </div>
              </div>

              {profile.learningGoal && (
                <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Primary Objective</span>
                  <p className="mt-1 text-xs text-slate-700 font-medium">{profile.learningGoal}</p>
                </div>
              )}
            </div>

            {/* Featured Projects Showcase Preview */}
            {projects.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <FolderGit2 size={16} className="text-purple-600" /> Featured Projects & Artifacts
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Highlighted open source work, live systems & software architecture.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('projects')}
                    className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 transition-colors"
                  >
                    View all ({projects.length}) →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {projects.slice(0, 2).map((proj) => (
                    <div
                      key={proj.id}
                      className="group flex flex-col overflow-hidden rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-purple-200 hover:shadow-md transition-all"
                    >
                      <div className="relative h-28 w-full overflow-hidden bg-slate-800">
                        <img
                          src={proj.imageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80'}
                          alt={proj.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {proj.featured && (
                          <div className="absolute top-2 left-2 flex items-center gap-1 rounded bg-amber-500 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-xs">
                            <Star size={10} className="fill-white" /> Featured
                          </div>
                        )}
                      </div>
                      <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{proj.title}</h4>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{proj.description}</p>
                        </div>
                        <div className="flex items-center gap-3 pt-2 text-[11px] font-bold">
                          {proj.demoUrl && (
                            <a
                              href={proj.demoUrl.startsWith('http') ? proj.demoUrl : `https://${proj.demoUrl}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-purple-600 hover:text-purple-700 flex items-center gap-1"
                            >
                              <Globe size={12} /> Demo
                            </a>
                          )}
                          {proj.githubUrl && (
                            <a
                              href={proj.githubUrl.startsWith('http') ? proj.githubUrl : `https://${proj.githubUrl}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-600 hover:text-slate-900 flex items-center gap-1"
                            >
                              <GithubIcon size={12} /> Code
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Learning Activity Heatmap */}
            <ActivityHeatmap userId={profile.id} theme="light" />
          </div>

          {/* Right Column: Skills & Endorsements */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Award size={16} className="text-purple-600" /> Skills & Peer Endorsements
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {isSelf ? 'Skills validated by your peers & trainers.' : 'Click to endorse and validate skills.'}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {(profile.skillsList && profile.skillsList.length > 0 
                  ? profile.skillsList 
                  : ['TypeScript', 'React.js', 'System Design', 'PostgreSQL', 'Cloud Architecture']
                ).map((skill) => {
                  const endInfo = endorsements[skill] || { count: 0, hasEndorsed: false, endorsers: [] };
                  const isLoading = endorseLoading[skill];

                  return (
                    <div
                      key={skill}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-xl border border-slate-100 bg-slate-50/70 p-3 hover:border-purple-200 hover:bg-purple-50/30 transition-all"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="truncate text-xs font-bold text-slate-800">
                          {skill}
                        </span>

                        {endInfo.count > 0 && (
                          <span className="flex items-center gap-1 rounded-md bg-purple-100 px-2 py-0.5 text-[10px] font-extrabold text-purple-700">
                            👍 {endInfo.count}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        {/* Endorser Avatars Stack */}
                        {endInfo.endorsers && endInfo.endorsers.length > 0 && (
                          <div className="flex -space-x-1.5 overflow-hidden pr-1">
                            {endInfo.endorsers.slice(0, 3).map((endorser: any, i: number) => (
                              <div
                                key={endorser.id || i}
                                title={`${endorser.name} endorsed this skill`}
                                className="inline-block h-5 w-5 rounded-full border border-white bg-purple-200 text-[9px] font-bold text-purple-800 flex items-center justify-center overflow-hidden"
                              >
                                {endorser.avatar ? (
                                  <img src={endorser.avatar} alt={endorser.name} className="h-full w-full object-cover" />
                                ) : (
                                  endorser.name?.charAt(0) || 'U'
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Endorse Button */}
                        {!isSelf && (
                          <button
                            onClick={() => handleToggleEndorse(skill)}
                            disabled={isLoading}
                            className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all ${
                              endInfo.hasEndorsed
                                ? 'bg-purple-600 text-white shadow-xs hover:bg-purple-700'
                                : 'border border-slate-200 bg-white text-slate-600 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700'
                            }`}
                          >
                            {isLoading ? (
                              <span className="animate-spin text-[10px]">⏳</span>
                            ) : endInfo.hasEndorsed ? (
                              <>
                                <span>✓</span> Endorsed
                              </>
                            ) : (
                              <>
                                <span>+</span> Endorse
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900">Quick Stats</h3>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Platform Status</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 size={13} /> Active Contributor
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Profile Verified</span>
                  <span className="font-bold text-purple-600 flex items-center gap-1">
                    <ShieldCheck size={13} /> Verified
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Projects & Showcase */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FolderGit2 size={18} className="text-purple-600" /> Engineering Projects & Artifacts
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Showcase of production code, open-source repositories, live deployments, and architecture blueprints.
              </p>
            </div>
            {isSelf && (
              <button
                onClick={handleOpenAddProject}
                className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-purple-700 transition-all self-start sm:self-auto"
              >
                <Plus size={15} /> Add Project
              </button>
            )}
          </div>

          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-lg hover:border-purple-200 transition-all"
                >
                  {/* Card Cover Photo */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                    <img
                      src={
                        project.imageUrl ||
                        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80'
                      }
                      alt={project.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                    {/* Featured Pin Badge */}
                    {project.featured && (
                      <div className="absolute top-3 left-3 flex items-center gap-1 rounded-lg bg-amber-500/90 px-2.5 py-1 text-[10px] font-extrabold text-white shadow-sm backdrop-blur-xs">
                        <Star size={12} className="fill-white" /> Featured
                      </div>
                    )}

                    {/* Self Edit Trigger */}
                    {isSelf && (
                      <button
                        onClick={() => handleOpenEditProject(project)}
                        className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-slate-700 shadow-sm hover:bg-white hover:text-purple-600 backdrop-blur-xs transition-colors"
                        title="Edit Project"
                      >
                        <Edit3 size={13} />
                      </button>
                    )}

                    {/* Title inside cover */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <h4 className="text-base font-bold text-white leading-tight drop-shadow-sm line-clamp-1">
                        {project.title}
                      </h4>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Tech Stack Pills */}
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action Links */}
                    <div className="flex items-center gap-2 border-t border-slate-100 pt-3">
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl.startsWith('http') ? project.demoUrl : `https://${project.demoUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-purple-600 px-3 py-2 text-xs font-bold text-white shadow-xs hover:bg-purple-700 transition-colors"
                        >
                          <Globe size={13} /> Live Demo
                        </a>
                      )}

                      {project.githubUrl && (
                        <a
                          href={project.githubUrl.startsWith('http') ? project.githubUrl : `https://${project.githubUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className={`flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700 transition-colors ${
                            project.demoUrl ? 'flex-initial' : 'flex-1'
                          }`}
                        >
                          <GithubIcon size={13} /> Code
                        </a>
                      )}

                      {!project.demoUrl && !project.githubUrl && (
                        <span className="text-[11px] text-slate-400 italic">No external links provided</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 mb-3">
                <FolderGit2 size={28} />
              </div>
              <h4 className="text-sm font-bold text-slate-900">No Projects Published Yet</h4>
              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                {isSelf
                  ? 'Add your software engineering projects, GitHub repositories, and live links to showcase your real-world capability.'
                  : 'This user has not published any projects to their portfolio showcase yet.'}
              </p>
              {isSelf && (
                <button
                  onClick={handleOpenAddProject}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-purple-700 transition-all"
                >
                  <Plus size={15} /> Add Your First Project
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab: Recommendations */}
      {activeTab === 'recommendations' && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Quote size={18} className="text-purple-600 fill-purple-100" /> Recommendations & Testimonials
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Verified character references and peer recommendations from mentors, managers, and collaborators.
              </p>
            </div>
            {!isSelf && (
              <button
                onClick={() => setRecommendationModalOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-purple-700 transition-all self-start sm:self-auto"
              >
                <Quote size={14} /> Write Recommendation
              </button>
            )}
          </div>

          {/* Pending Approval Banner (For Profile Owner) */}
          {isSelf && pendingRecommendations.length > 0 && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-white text-xs font-bold">
                    {pendingRecommendations.length}
                  </span>
                  <h4 className="text-sm font-bold text-amber-950">
                    Recommendations Waiting for Your Approval
                  </h4>
                </div>
                <span className="text-[11px] font-semibold text-amber-800">
                  Visible only to you until accepted
                </span>
              </div>

              <div className="space-y-3">
                {pendingRecommendations.map((pending) => (
                  <div
                    key={pending.id}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-amber-200/80 bg-white p-4 shadow-xs"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center overflow-hidden">
                          {pending.author.avatar ? (
                            <img src={pending.author.avatar} alt={pending.author.name} className="h-full w-full object-cover" />
                          ) : (
                            pending.author.name.charAt(0)
                          )}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-900">{pending.author.name}</span>
                          <span className="text-[11px] text-slate-500 block">
                            {pending.relationship}  {pending.author.organization ? `at ${pending.author.organization}` : ''}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-700 italic bg-amber-50/50 p-3 rounded-lg border border-amber-100/60">
                        "{pending.content}"
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      <button
                        onClick={() => handleRespondRecommendation(pending.id, 'REJECTED')}
                        disabled={respondingRecId === pending.id}
                        className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleRespondRecommendation(pending.id, 'ACCEPTED')}
                        disabled={respondingRecId === pending.id}
                        className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-purple-700 transition-all"
                      >
                        <Check size={14} /> Accept & Feature
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* List of Accepted Recommendations */}
          {recommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all space-y-4"
                >
                  {/* Author Meta */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => navigate(`/profile/${rec.author.id}`)}
                        className="h-12 w-12 shrink-0 rounded-2xl border border-slate-100 bg-purple-100 text-purple-700 font-bold text-base flex items-center justify-center overflow-hidden hover:opacity-90 transition-opacity shadow-xs"
                      >
                        {rec.author.avatar ? (
                          <img src={rec.author.avatar} alt={rec.author.name} className="h-full w-full object-cover" />
                        ) : (
                          rec.author.name.charAt(0)
                        )}
                      </button>

                      <div>
                        <button
                          onClick={() => navigate(`/profile/${rec.author.id}`)}
                          className="text-sm font-extrabold text-slate-900 hover:text-purple-600 text-left transition-colors"
                        >
                          {rec.author.name}
                        </button>
                        <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                          <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                            {rec.relationship}
                          </span>
                          {rec.author.organization && (
                            <span className="text-[11px] text-slate-400">
                              • {rec.author.organization}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {(isSelf || rec.author.id === currentUser?.id) && (
                      <button
                        onClick={() => handleDeleteRecommendation(rec.id)}
                        className="text-slate-300 hover:text-rose-500 p-1 transition-colors"
                        title="Delete Recommendation"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>

                  {/* Testimonial Quote */}
                  <div className="relative rounded-xl bg-slate-50/80 border border-slate-100 p-4">
                    <Quote size={20} className="text-purple-200 fill-purple-100 absolute -top-2.5 left-3" />
                    <p className="text-xs text-slate-700 leading-relaxed italic whitespace-pre-line pt-1">
                      "{rec.content}"
                    </p>
                  </div>

                  {/* Footer Date */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                    <span>Verified Recommendation</span>
                    <span>{new Date(rec.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 mb-3">
                <Quote size={26} className="fill-purple-100" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">No Recommendations Yet</h4>
              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                {isSelf
                  ? 'Ask colleagues, trainers, or project partners to vouch for your technical excellence and team contributions.'
                  : 'Be the first colleague or mentor to write a recommendation for this profile!'}
              </p>
              {!isSelf && (
                <button
                  onClick={() => setRecommendationModalOpen(true)}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-purple-700 transition-all"
                >
                  <Quote size={14} /> Write the First Recommendation
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Competency Radar */}
      {activeTab === 'competency' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900">Competency DNA Breakdown</h3>
            <p className="mt-1 text-xs text-slate-500">Visual synthesis of verified skill capabilities.</p>
            <div className="mt-4 h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <Radar name="Competency" dataKey="A" stroke="#9333ea" fill="#9333ea" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Skill Dimension Ratings</h3>
            {radarData.map((d, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">{d.subject}</span>
                  <span className="text-purple-600 font-bold">{d.A}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full"
                    style={{ width: `${d.A}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Authored Courses */}
      {activeTab === 'courses' && profile.role === 'TRAINER' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {profile.courses && profile.courses.length > 0 ? (
            profile.courses.map((course) => (
              <div key={course.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                    {course.status}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(course.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{course.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-2">{course.description}</p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {course.targetCompetencies?.map((c, i) => (
                    <span key={i} className="rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-semibold text-purple-700">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 py-12 text-center text-xs text-slate-400">
              No authored courses published yet.
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Badges & Credentials */}
      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: 'Fast Learner', desc: 'Completed 5 competencies within the first 30 days', icon: '⚡' },
            { title: 'Top Contributor', desc: 'Earned highest evidence score in technical track', icon: '🏆' },
            { title: 'Community Mentor', desc: 'Followed by over 10 peers across the platform', icon: '🌟' },
          ].map((badge, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm text-center space-y-2">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-2xl">
                {badge.icon}
              </div>
              <h4 className="text-sm font-bold text-slate-900">{badge.title}</h4>
              <p className="text-xs text-slate-500">{badge.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* Project Modal */}
      <ProjectModal
        isOpen={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        project={selectedProject}
        onSuccess={handleProjectSuccess}
        onDelete={handleProjectDelete}
      />

      {/* Recommendation Modal */}
      <RecommendationModal
        isOpen={recommendationModalOpen}
        onClose={() => setRecommendationModalOpen(false)}
        targetUserId={profile.id}
        targetUserName={profile.name}
        onSuccess={handleRecommendationSuccess}
      />

      {/* Followers / Following Modal */}
      <FollowListModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalType === 'followers' ? 'Followers' : 'Following'}
        users={modalUsers}
        loading={modalLoading}
        onFollowToggle={(userId, status) => {
          if (modalType === 'following' && isSelf) {
            setFollowingCount((prev) => (status ? prev + 1 : Math.max(0, prev - 1)));
          }
        }}
      />
    </div>
  );
};

export const PublicProfile: React.FC = () => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-12">
        <PublicProfileView />
      </div>
    );
  }

  if (user.role === 'TRAINER') {
    return (
      <TrainerLayout>
        <PublicProfileView />
      </TrainerLayout>
    );
  }

  if (user.role === 'MANAGER' || user.role === 'ADMIN') {
    return (
      <ManagerLayout>
        <PublicProfileView />
      </ManagerLayout>
    );
  }

  return (
    <AppShell>
      <PublicProfileView />
    </AppShell>
  );
};
