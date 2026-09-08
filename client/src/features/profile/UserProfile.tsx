// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Building, 
  Briefcase, 
  Target, 
  GraduationCap, 
  ShieldCheck, 
  KeyRound, 
  Trophy, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Camera, 
  Edit3, 
  Save, 
  Flame, 
  Zap, 
  Brain, 
  Check, 
  Lock, 
  Bell, 
  Eye, 
  EyeOff, 
  ArrowRight,
  TrendingUp,
  Award,
  Globe,
  Smartphone,
  FolderGit2,
  Plus,
  Star,
  ExternalLink,
  Quote
} from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '../../api/auth.api';
import { userApi } from '../../api/user.api';
import type { UserProject, Recommendation } from '../../api/user.api';
import { FollowListModal } from './FollowListModal';
import { ActivityHeatmap } from './ActivityHeatmap';
import { ProjectModal } from './ProjectModal';
import { ProjectPreviewModal } from './ProjectPreviewModal';
import { RequestRecommendationModal } from './RequestRecommendationModal';
import { AppShell } from '../../components/layout/AppShell';
import { TrainerLayout } from '../../layouts/TrainerLayout';
import { ManagerLayout } from '../../layouts/ManagerLayout';

const GithubIcon: React.FC<{ size?: number; className?: string }> = ({ size = 14, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
];

const ROLES_LIST = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Analyst',
  'Data Scientist',
  'Machine Learning Engineer',
  'DevOps & Cloud Engineer',
  'UI/UX Designer',
  'Project Manager',
  'Engineering Manager',
  'Solutions Architect',
];

const LEARNING_GOALS = [
  'Master full stack engineering capabilities',
  'Transition into senior engineering leadership',
  'Upskill in AI & Distributed Systems',
  'Improve system architecture and cloud readiness',
  'Gain industry certificates & competency mastery',
];

export const UserProfileView = ({ defaultTab = 'profile' }: { defaultTab?: string }) => {
  const { user, updateUser } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') || defaultTab;

  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'recommendations' | 'competency' | 'security' | 'activity'>(
    (initialTab as any) || 'profile'
  );

  // Form states
  const [name, setName] = useState(user?.name || '');
  const [organization, setOrganization] = useState(user?.organization || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [currentRole, setCurrentRole] = useState(user?.currentRole || '');
  const [targetRole, setTargetRole] = useState(user?.targetRole || '');
  const [learningGoal, setLearningGoal] = useState(user?.learningGoal || '');
  const [experienceLevel, setExperienceLevel] = useState(user?.experienceLevel || 'Intermediate');
  const [githubUrl, setGithubUrl] = useState(user?.githubUrl || '');
  const [linkedinUrl, setLinkedinUrl] = useState(user?.linkedinUrl || '');
  const [twitterUrl, setTwitterUrl] = useState(user?.twitterUrl || '');
  const [websiteUrl, setWebsiteUrl] = useState(user?.websiteUrl || '');
  const [locationStr, setLocationStr] = useState(user?.location || '');
  const [skillsInput, setSkillsInput] = useState(user?.skillsList?.join(', ') || '');

  // Projects state & modal
  const [projects, setProjects] = useState<UserProject[]>([]);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<UserProject | null>(null);
  const [previewProject, setPreviewProject] = useState<UserProject | null>(null);
  const [projectSearchQuery, setProjectSearchQuery] = useState('');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(null);

  // Recommendations state
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [pendingRecommendations, setPendingRecommendations] = useState<Recommendation[]>([]);
  const [givenRecommendations, setGivenRecommendations] = useState<Recommendation[]>([]);
  const [recSubTab, setRecSubTab] = useState<'received' | 'given'>('received');
  const [requestRecModalOpen, setRequestRecModalOpen] = useState(false);
  const [respondingRecId, setRespondingRecId] = useState<string | null>(null);

  // Social follower stats & modal
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followModalOpen, setFollowModalOpen] = useState(false);
  const [followModalType, setFollowModalType] = useState<'followers' | 'following'>('followers');
  const [followModalUsers, setFollowModalUsers] = useState<any[]>([]);
  const [followModalLoading, setFollowModalLoading] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status & notifications
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [passSuccess, setPassSuccess] = useState<string | null>(null);
  const [passError, setPassError] = useState<string | null>(null);

  // Notification Preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [courseReminders, setCourseReminders] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setOrganization(user.organization || '');
      setAvatar(user.avatar || '');
      setBio(user.bio || '');
      setCurrentRole(user.currentRole || '');
      setTargetRole(user.targetRole || '');
      setLearningGoal(user.learningGoal || '');
      setExperienceLevel(user.experienceLevel || 'Intermediate');
      setGithubUrl(user.githubUrl || '');
      setLinkedinUrl(user.linkedinUrl || '');
      setTwitterUrl(user.twitterUrl || '');
      setWebsiteUrl(user.websiteUrl || '');
      setLocationStr(user.location || '');
      setSkillsInput(user.skillsList?.join(', ') || '');

      // Load follower / following counts
      authApi.getMe().then(res => {
        if (res.data) {
          updateUser(res.data);
        }
      }).catch(console.error);

      if (user.id) {
        userApi.getProfile(user.id).then(res => {
          setFollowersCount(res.data.stats?.followersCount || 0);
          setFollowingCount(res.data.stats?.followingCount || 0);
          setProjects(res.data.user?.projects || []);
        }).catch(console.error);

        userApi.getRecommendations(user.id).then(res => {
          setRecommendations(res.data.recommendations || []);
          setPendingRecommendations(res.data.pendingRecommendations || []);
        }).catch(console.error);

        userApi.getGivenRecommendations().then(res => {
          if (res.data?.recommendations) {
            setGivenRecommendations(res.data.recommendations);
          }
        }).catch(console.error);
      }
    }
  }, [user?.id]);

  const handleRespondRec = async (recId: string, status: 'ACCEPTED' | 'REJECTED') => {
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
      console.error(err);
    } finally {
      setRespondingRecId(null);
    }
  };

  const handleDeleteRec = async (recId: string) => {
    if (!window.confirm('Are you sure you want to remove this recommendation?')) return;
    try {
      await userApi.deleteRecommendation(recId);
      setRecommendations((prev) => prev.filter((r) => r.id !== recId));
      setPendingRecommendations((prev) => prev.filter((r) => r.id !== recId));
    } catch (err) {
      console.error(err);
    }
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

  const handleOpenFollowModal = async (type: 'followers' | 'following') => {
    if (!user?.id) return;
    setFollowModalType(type);
    setFollowModalOpen(true);
    setFollowModalLoading(true);
    try {
      if (type === 'followers') {
        const res = await userApi.getFollowers(user.id);
        setFollowModalUsers(res.data.followers);
      } else {
        const res = await userApi.getFollowing(user.id);
        setFollowModalUsers(res.data.following);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFollowModalLoading(false);
    }
  };

  // Handle Profile Update
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(null);
    setSaveError(null);

    const parsedSkills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const payload = {
        name,
        organization,
        avatar,
        bio,
        currentRole,
        targetRole,
        learningGoal,
        experienceLevel,
        githubUrl,
        linkedinUrl,
        twitterUrl,
        websiteUrl,
        location: locationStr,
        skillsList: parsedSkills,
      };

      const response = await authApi.updateProfile(payload);

      if (response.data.user) {
        updateUser(response.data.user);
      } else {
        updateUser(payload);
      }

      setSaveSuccess('Your profile and social details have been updated!');
      setTimeout(() => setSaveSuccess(null), 4000);
    } catch (err: any) {
      setSaveError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Password Update
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPassError('New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setPassError('Password must be at least 8 characters');
      return;
    }

    setIsChangingPass(true);
    setPassSuccess(null);
    setPassError(null);

    try {
      await authApi.updatePassword({ currentPassword, newPassword });
      setPassSuccess('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPassSuccess(null), 4000);
    } catch (err: any) {
      setPassError(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setIsChangingPass(false);
    }
  };

  // Profile completion calculation
  const calculateCompletion = () => {
    let score = 30; // base score for account creation
    if (name) score += 15;
    if (organization) score += 10;
    if (bio) score += 15;
    if (currentRole) score += 10;
    if (targetRole) score += 10;
    if (learningGoal) score += 10;
    return Math.min(score, 100);
  };

  const completionRate = calculateCompletion();

  // Radar chart data for competency DNA
  const radarData = [
    { subject: 'Technical', A: 85, fullMark: 100 },
    { subject: 'Analytical', A: 78, fullMark: 100 },
    { subject: 'Communication', A: 70, fullMark: 100 },
    { subject: 'Leadership', A: 65, fullMark: 100 },
    { subject: 'Creativity', A: 80, fullMark: 100 },
  ];

  const roleBadgeColor = 
    user?.role === 'ADMIN' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
    user?.role === 'MANAGER' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
    user?.role === 'TRAINER' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' :
    'bg-purple-500/10 text-purple-400 border-purple-500/30';

  return (
    <div className="space-y-8 pb-20 text-slate-100 max-w-6xl mx-auto">
      {/* Hero Banner & Profile Header */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-6 md:p-8 backdrop-blur-xl shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar with image or initials */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl border-2 border-purple-500/40 bg-purple-950/60 flex items-center justify-center text-3xl font-bold text-purple-200 overflow-hidden shadow-lg shadow-purple-500/10">
                {avatar ? (
                  <img src={avatar} alt={name || 'User Avatar'} className="w-full h-full object-cover" />
                ) : (
                  <span>{name ? name.charAt(0).toUpperCase() : 'U'}</span>
                )}
              </div>
              <button 
                onClick={() => {
                  const nextPreset = AVATAR_PRESETS[Math.floor(Math.random() * AVATAR_PRESETS.length)];
                  setAvatar(nextPreset);
                }}
                title="Cycle through avatar presets"
                className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-lg transition-transform hover:scale-110"
              >
                <Camera size={14} />
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  {name || 'Your Profile'}
                </h1>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider uppercase border ${roleBadgeColor}`}>
                  {user?.role || 'Learner'}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium">
                  <CheckCircle2 size={13} /> Verified
                </span>
              </div>

              <p className="text-sm text-slate-400 flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1"><Mail size={14} className="text-slate-500" /> {user?.email}</span>
                {organization && (
                  <span className="flex items-center gap-1 border-l border-white/10 pl-2">
                    <Building size={14} className="text-slate-500" /> {organization}
                  </span>
                )}
                {currentRole && (
                  <span className="flex items-center gap-1 border-l border-white/10 pl-2 text-purple-300">
                    <Briefcase size={14} className="text-purple-400" /> {currentRole}
                  </span>
                )}
              </p>

              {bio && <p className="text-xs text-slate-300 max-w-xl line-clamp-2 pt-1">{bio}</p>}
            </div>
          </div>

          {/* Profile Strength / Score Card */}
          <div className="w-full md:w-auto self-stretch md:self-auto flex flex-col justify-center rounded-xl bg-white/[0.04] border border-white/10 p-4 min-w-[220px]">
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-slate-400 uppercase tracking-wider">Profile Strength</span>
              <span className="text-purple-400">{completionRate}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${completionRate}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => navigate(`/profile/${user?.id}`)}
                className="flex items-center gap-1.5 rounded-lg bg-purple-600/30 border border-purple-500/40 px-3 py-1.5 text-xs font-semibold text-purple-200 hover:bg-purple-600 hover:text-white transition-all w-full justify-center"
              >
                <Eye size={13} /> View Public Profile
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stat Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <button
            type="button"
            onClick={() => handleOpenFollowModal('followers')}
            className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 hover:bg-purple-500/10 transition-all text-left group"
          >
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block group-hover:text-purple-300">Followers</span>
            <span className="text-xl font-bold text-white group-hover:text-purple-400 mt-0.5 block">{followersCount}</span>
          </button>
          <button
            type="button"
            onClick={() => handleOpenFollowModal('following')}
            className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 hover:bg-purple-500/10 transition-all text-left group"
          >
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block group-hover:text-purple-300">Following</span>
            <span className="text-xl font-bold text-white group-hover:text-purple-400 mt-0.5 block">{followingCount}</span>
          </button>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Active Streak</span>
            <span className="text-xl font-bold text-amber-400 mt-0.5 block flex items-center gap-1">
              <Flame size={18} /> 12 Days
            </span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Certificates</span>
            <span className="text-xl font-bold text-indigo-400 mt-0.5 block">4 Verified</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-white/10 gap-2 overflow-x-auto pb-1">
        {[
          { id: 'profile', label: 'Personal & Career', icon: User },
          { id: 'projects', label: 'Portfolio Projects', icon: FolderGit2 },
          { id: 'recommendations', label: `Recommendations (${recommendations.length})`, icon: Quote },
          { id: 'competency', label: 'Competency DNA', icon: Brain },
          { id: 'security', label: 'Security & Preferences', icon: ShieldCheck },
          { id: 'activity', label: 'Milestones & Badges', icon: Trophy },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold rounded-lg transition-all relative whitespace-nowrap ${
                isActive 
                  ? 'text-purple-300 bg-white/[0.08] shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-purple-400' : 'text-slate-400'} />
              {tab.label}
              {isActive && (
                <motion.div 
                  layoutId="profileTabHighlight" 
                  className="absolute bottom-0 left-2 right-2 h-0.5 bg-purple-500 rounded-full" 
                />
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: Profile & Career Details */}
      {activeTab === 'profile' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-6"
        >
          {saveSuccess && (
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-3 text-emerald-400 text-sm">
              <CheckCircle2 size={18} className="shrink-0" />
              <span>{saveSuccess}</span>
            </div>
          )}

          {saveError && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-3 text-rose-400 text-sm">
              <AlertCircle size={18} className="shrink-0" />
              <span>{saveError}</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Columns: Main Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 space-y-5">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <User size={18} className="text-purple-400" /> Basic Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Morgan"
                      required
                      className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full rounded-lg border border-white/5 bg-white/[0.02] px-3.5 py-2.5 text-sm text-slate-400 cursor-not-allowed outline-none"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">Managed by authentication provider.</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Organization / Company
                    </label>
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="e.g. Acme Corp or Team Alpha"
                      className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Experience Level
                    </label>
                    <select
                      value={experienceLevel}
                      onChange={(e) => setExperienceLevel(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-[#161522] px-3.5 py-2.5 text-sm text-white outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    >
                      <option value="Beginner">Beginner (0-2 years)</option>
                      <option value="Intermediate">Intermediate (2-5 years)</option>
                      <option value="Advanced">Advanced (5+ years)</option>
                      <option value="Lead">Principal / Lead (8+ years)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Bio & Background Summary
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell your team about your technical focus, experience, and passions..."
                    className="w-full rounded-lg border border-white/10 bg-white/[0.05] p-3 text-sm text-white placeholder-slate-500 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none"
                  />
                </div>
              </div>

              {/* Career Trajectory & Objectives */}
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 space-y-5">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Target size={18} className="text-purple-400" /> Career Trajectory & Growth
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Current Role
                    </label>
                    <input
                      type="text"
                      list="roles-options"
                      value={currentRole}
                      onChange={(e) => setCurrentRole(e.target.value)}
                      placeholder="e.g. Frontend Developer"
                      className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Target Role / Aspiration
                    </label>
                    <input
                      type="text"
                      list="roles-options"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      placeholder="e.g. Full Stack Architect"
                      className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <datalist id="roles-options">
                  {ROLES_LIST.map((r) => (
                    <option key={r} value={r} />
                  ))}
                </datalist>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Primary Learning Goal
                  </label>
                  <select
                    value={learningGoal}
                    onChange={(e) => setLearningGoal(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-[#161522] px-3.5 py-2.5 text-sm text-white outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="">Select or customize your goal</option>
                    {LEARNING_GOALS.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Social Profiles & Skills */}
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 space-y-5">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Globe size={18} className="text-purple-400" /> Social Links & Skills Cloud
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      GitHub URL or Username
                    </label>
                    <input
                      type="text"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="e.g. github.com/username"
                      className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      LinkedIn Profile
                    </label>
                    <input
                      type="text"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      placeholder="e.g. linkedin.com/in/username"
                      className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Twitter / X Handle or URL
                    </label>
                    <input
                      type="text"
                      value={twitterUrl}
                      onChange={(e) => setTwitterUrl(e.target.value)}
                      placeholder="e.g. twitter.com/handle"
                      className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Personal Portfolio / Website
                    </label>
                    <input
                      type="text"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="e.g. https://myportfolio.dev"
                      className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Location / Timezone
                    </label>
                    <input
                      type="text"
                      value={locationStr}
                      onChange={(e) => setLocationStr(e.target.value)}
                      placeholder="e.g. San Francisco, CA or Remote"
                      className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Top Skill Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={skillsInput}
                      onChange={(e) => setSkillsInput(e.target.value)}
                      placeholder="e.g. React, TypeScript, GraphQL, Node.js"
                      className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end gap-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
                >
                  <Save size={16} />
                  {isSaving ? 'Saving Changes...' : 'Save Profile Changes'}
                </button>
              </div>
            </div>

            {/* Right Column: Avatar Presets & Checklist */}
            <div className="space-y-6">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Camera size={18} className="text-purple-400" /> Choose Profile Avatar
                </h3>
                <p className="text-xs text-slate-400">
                  Select an avatar style or enter a custom image URL.
                </p>

                <div className="grid grid-cols-3 gap-3">
                  {AVATAR_PRESETS.map((preset, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setAvatar(preset)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                        avatar === preset ? 'border-purple-400 scale-105 shadow-md shadow-purple-500/20' : 'border-transparent opacity-60 hover:opacity-100 hover:border-white/20'
                      }`}
                    >
                      <img src={preset} alt={`Preset ${index}`} className="w-full h-full object-cover" />
                      {avatar === preset && (
                        <div className="absolute top-1 right-1 bg-purple-600 rounded-full p-0.5 text-white">
                          <Check size={10} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Custom Image URL
                  </label>
                  <input
                    type="url"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://..."
                    className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Profile Completion Checklist */}
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 space-y-3.5">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Checklist to 100%
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 size={14} className={name ? 'text-emerald-400' : 'text-slate-600'} />
                    <span>Set your Full Name</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 size={14} className={organization ? 'text-emerald-400' : 'text-slate-600'} />
                    <span>Provide your Organization</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 size={14} className={bio ? 'text-emerald-400' : 'text-slate-600'} />
                    <span>Write a short Bio</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 size={14} className={currentRole && targetRole ? 'text-emerald-400' : 'text-slate-600'} />
                    <span>Define Current & Target Roles</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 size={14} className={learningGoal ? 'text-emerald-400' : 'text-slate-600'} />
                    <span>Select a Learning Goal</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </motion.div>
      )}

      {/* TAB 2: Portfolio Projects */}
      {activeTab === 'projects' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-6"
        >
          {/* Header & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FolderGit2 size={18} className="text-purple-400" /> Engineering Portfolio & Projects ({projects.length})
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Showcase your production apps, open-source repositories, and technical accomplishments.
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenAddProject}
              className="flex items-center gap-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-purple-600/30 transition-all self-start sm:self-auto"
            >
              <Plus size={15} /> Add New Project
            </button>
          </div>

          {/* Search & Tag Filter Bar */}
          {projects.length > 0 && (
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white/[0.02] border border-white/5 p-3 rounded-xl">
              <input
                type="text"
                value={projectSearchQuery}
                onChange={(e) => setProjectSearchQuery(e.target.value)}
                placeholder="Search projects by title or description..."
                className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500 min-w-[240px]"
              />

              {/* Tag filters */}
              <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setSelectedTagFilter(null)}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition-all ${
                    selectedTagFilter === null
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/[0.04] text-slate-400 hover:text-white'
                  }`}
                >
                  All ({projects.length})
                </button>
                {Array.from(new Set(projects.flatMap((p) => p.tags || []))).slice(0, 8).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedTagFilter(selectedTagFilter === tag ? null : tag)}
                    className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition-all ${
                      selectedTagFilter === tag
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-white/[0.04] text-slate-400 hover:text-white'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Projects Grid */}
          {(() => {
            const filteredProjects = projects.filter((p) => {
              const matchesSearch =
                !projectSearchQuery ||
                p.title.toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
                p.description.toLowerCase().includes(projectSearchQuery.toLowerCase());
              const matchesTag =
                !selectedTagFilter || (p.tags && p.tags.includes(selectedTagFilter));
              return matchesSearch && matchesTag;
            });

            if (filteredProjects.length === 0 && projects.length > 0) {
              return (
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-8 text-center text-xs text-slate-400">
                  No projects matching your filter. Try adjusting search or tag filter.
                </div>
              );
            }

            if (projects.length === 0) {
              return (
                <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 mb-3">
                    <FolderGit2 size={26} />
                  </div>
                  <h4 className="text-sm font-bold text-white">No Projects Added Yet</h4>
                  <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
                    Add your side projects, engineering accomplishments, and repositories to display on your public profile.
                  </p>
                  <button
                    type="button"
                    onClick={handleOpenAddProject}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-purple-600/30 transition-all"
                  >
                    <Plus size={15} /> Add Your First Project
                  </button>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((proj) => (
                  <div
                    key={proj.id}
                    className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-500/5 transition-all cursor-pointer"
                    onClick={() => setPreviewProject(proj)}
                  >
                    <div className="relative h-40 w-full overflow-hidden bg-slate-950">
                      <img
                        src={
                          proj.imageUrl ||
                          'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80'
                        }
                        alt={proj.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

                      {proj.featured && (
                        <div className="absolute top-3 left-3 flex items-center gap-1 rounded-md bg-amber-500/90 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                          <Star size={11} className="fill-white" /> Featured
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditProject(proj);
                        }}
                        className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-lg bg-black/60 text-slate-200 hover:text-white hover:bg-purple-600 transition-colors"
                        title="Edit Project"
                      >
                        <Edit3 size={13} />
                      </button>

                      <div className="absolute bottom-3 left-3 right-3">
                        <h4 className="text-sm font-bold text-white line-clamp-1">{proj.title}</h4>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-4 space-y-4">
                      <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                        {proj.description}
                      </p>

                      {proj.tags && proj.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {proj.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="rounded-md bg-purple-500/15 border border-purple-500/20 px-2 py-0.5 text-[10px] font-medium text-purple-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div
                        className="flex items-center gap-2 border-t border-white/5 pt-3 text-xs"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {proj.demoUrl && (
                          <a
                            href={proj.demoUrl.startsWith('http') ? proj.demoUrl : `https://${proj.demoUrl}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 px-3 py-1.5 font-semibold text-white transition-colors"
                          >
                            <Globe size={13} /> Live Demo
                          </a>
                        )}
                        {proj.githubUrl && (
                          <a
                            href={proj.githubUrl.startsWith('http') ? proj.githubUrl : `https://${proj.githubUrl}`}
                            target="_blank"
                            rel="noreferrer"
                            className={`flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 font-semibold text-slate-300 hover:text-white hover:border-white/20 transition-colors ${
                              proj.demoUrl ? 'flex-initial' : 'flex-1'
                            }`}
                          >
                            <GithubIcon size={13} /> Code
                          </a>
                        )}
                        {!proj.demoUrl && !proj.githubUrl && (
                          <span className="text-[11px] text-slate-500 italic">Click card for preview</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </motion.div>
      )}

      {/* TAB 3: Recommendations */}
      {activeTab === 'recommendations' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-6"
        >
          {/* Header & Sub-tab Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Quote size={18} className="text-purple-400 fill-purple-400/20" /> Recommendations & Testimonials
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Manage received recommendations and request testimonials from your network.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRequestRecModalOpen(true)}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition-all"
              >
                <Sparkles size={14} /> Request Recommendation
              </button>
              <button
                type="button"
                onClick={() => navigate(`/profile/${user?.id}`)}
                className="flex items-center gap-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] border border-purple-500/30 px-3.5 py-2 text-xs font-semibold text-purple-300 transition-all"
              >
                <Eye size={14} /> Public View
              </button>
            </div>
          </div>

          {/* Sub-tabs: Received vs Given */}
          <div className="flex items-center gap-2 border-b border-white/10 pb-2">
            <button
              type="button"
              onClick={() => setRecSubTab('received')}
              className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                recSubTab === 'received'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white bg-white/[0.03]'
              }`}
            >
              Received Testimonials ({recommendations.length})
              {pendingRecommendations.length > 0 && (
                <span className="ml-1.5 rounded-full bg-amber-400 px-1.5 py-0.2 text-[10px] font-black text-slate-950">
                  {pendingRecommendations.length}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setRecSubTab('given')}
              className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                recSubTab === 'given'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white bg-white/[0.03]'
              }`}
            >
              Given by Me ({givenRecommendations.length})
            </button>
          </div>

          {recSubTab === 'received' && (
            <div className="space-y-6">
              {/* Pending Approval Section */}
              {pendingRecommendations.length > 0 && (
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-slate-950 text-xs font-bold">
                        {pendingRecommendations.length}
                      </span>
                      <h4 className="text-sm font-bold text-amber-200">
                        Recommendations Awaiting Your Approval
                      </h4>
                    </div>
                    <span className="text-[11px] text-amber-400">
                      Visible publicly once accepted
                    </span>
                  </div>

                  <div className="space-y-3">
                    {pendingRecommendations.map((pending) => (
                      <div
                        key={pending.id}
                        className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.04] p-4"
                      >
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-purple-900/60 text-purple-200 font-bold text-xs flex items-center justify-center overflow-hidden border border-purple-500/30">
                              {pending.author.avatar ? (
                                <img src={pending.author.avatar} alt={pending.author.name} className="h-full w-full object-cover" />
                              ) : (
                                pending.author.name.charAt(0)
                              )}
                            </div>
                            <div>
                              <span className="text-xs font-bold text-white">{pending.author.name}</span>
                              <span className="text-[11px] text-slate-400 block">
                                {pending.relationship} {pending.author.organization ? `at ${pending.author.organization}` : ''}
                              </span>
                            </div>
                          </div>
                          <p className="text-xs text-slate-300 italic bg-black/20 p-3 rounded-lg border border-white/5">
                            "{pending.content}"
                          </p>
                        </div>

                        <div className="flex items-center gap-2 self-end md:self-center">
                          <button
                            type="button"
                            onClick={() => handleRespondRec(pending.id, 'REJECTED')}
                            disabled={respondingRecId === pending.id}
                            className="rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs font-semibold text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-colors"
                          >
                            Decline
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRespondRec(pending.id, 'ACCEPTED')}
                            disabled={respondingRecId === pending.id}
                            className="flex items-center gap-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 px-4 py-1.5 text-xs font-semibold text-white shadow-md shadow-purple-600/30 transition-all"
                          >
                            <Check size={14} /> Accept & Feature
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Accepted List */}
              {recommendations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recommendations.map((rec) => (
                    <div
                      key={rec.id}
                      className="flex flex-col justify-between rounded-xl border border-white/10 bg-white/[0.03] p-5 space-y-4 hover:border-purple-500/30 transition-all"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 shrink-0 rounded-xl bg-purple-900/60 text-purple-200 font-bold text-sm flex items-center justify-center overflow-hidden border border-purple-500/30">
                            {rec.author.avatar ? (
                              <img src={rec.author.avatar} alt={rec.author.name} className="h-full w-full object-cover" />
                            ) : (
                              rec.author.name.charAt(0)
                            )}
                          </div>
                          <div>
                            <span className="text-sm font-bold text-white block">{rec.author.name}</span>
                            <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                              <span className="text-[10px] font-medium text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/30">
                                {rec.relationship}
                              </span>
                              {rec.author.organization && (
                                <span className="text-[10px] text-slate-400">
                                  • {rec.author.organization}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteRec(rec.id)}
                          className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                          title="Remove Recommendation"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="rounded-lg bg-white/[0.02] border border-white/5 p-3.5 text-xs text-slate-300 italic leading-relaxed">
                        "{rec.content}"
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-white/5">
                        <span className="text-emerald-400 font-medium flex items-center gap-1">
                          <CheckCircle2 size={12} /> Active on Profile
                        </span>
                        <span>{new Date(rec.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 mb-3">
                    <Quote size={24} className="fill-purple-400/20" />
                  </div>
                  <h4 className="text-sm font-bold text-white">No Testimonials Received Yet</h4>
                  <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
                    Colleagues, managers, and mentors can write recommendations directly on your public profile or you can send a direct request.
                  </p>
                  <button
                    type="button"
                    onClick={() => setRequestRecModalOpen(true)}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition-all"
                  >
                    <Sparkles size={14} /> Request Your First Recommendation
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Given by Me Sub-tab */}
          {recSubTab === 'given' && (
            <div className="space-y-4">
              {givenRecommendations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {givenRecommendations.map((rec) => (
                    <div
                      key={rec.id}
                      className="flex flex-col justify-between rounded-xl border border-white/10 bg-white/[0.03] p-5 space-y-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 shrink-0 rounded-xl bg-indigo-900/60 text-indigo-200 font-bold text-sm flex items-center justify-center overflow-hidden border border-indigo-500/30">
                            {rec.recipient?.avatar ? (
                              <img src={rec.recipient.avatar} alt={rec.recipient.name} className="h-full w-full object-cover" />
                            ) : (
                              rec.recipient?.name?.charAt(0) || 'U'
                            )}
                          </div>
                          <div>
                            <span className="text-xs text-slate-400 block">Written for:</span>
                            <span className="text-sm font-bold text-white">{rec.recipient?.name || 'User'}</span>
                            <span className="text-[10px] text-purple-300 block mt-0.5">{rec.relationship}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            rec.status === 'ACCEPTED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                            rec.status === 'REJECTED' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                            'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}>
                            {rec.status}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteRec(rec.id)}
                            className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                            title="Delete Recommendation"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="rounded-lg bg-white/[0.02] border border-white/5 p-3.5 text-xs text-slate-300 italic leading-relaxed">
                        "{rec.content}"
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-white/5">
                        <span>Submitted on {new Date(rec.createdAt).toLocaleDateString()}</span>
                        <a
                          href={`/profile/${rec.recipientId}`}
                          className="text-purple-400 hover:text-purple-300 font-medium"
                        >
                          View Profile →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 mb-3">
                    <Sparkles size={24} />
                  </div>
                  <h4 className="text-sm font-bold text-white">No Recommendations Written Yet</h4>
                  <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
                    Visit the public profile of colleagues or trainees in Discover Network to write testimonials for them!
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* TAB 4: Competency DNA */}
      {activeTab === 'competency' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Radar Visualization */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Competency DNA Polygon</h3>
                <p className="text-xs text-slate-400 mt-0.5">Multi-dimensional capability distribution</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold border border-purple-500/20">
                Tier: Advanced
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.12)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Radar name="Competency" dataKey="A" stroke="#a855f7" fill="#8b5cf6" fillOpacity={0.45} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
              <span className="text-slate-400">Target Role Match</span>
              <span className="font-bold text-purple-400">{targetRole || 'Full Stack Engineer'} (82%)</span>
            </div>
          </div>

          {/* Skill Breakdown */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 space-y-5">
            <h3 className="text-base font-bold text-white">Core Skill Proficiencies</h3>

            <div className="space-y-4">
              {[
                { name: 'TypeScript & JavaScript', level: 88, category: 'Technical' },
                { name: 'React.js & Next.js Architecture', level: 84, category: 'Technical' },
                { name: 'Node.js & API Engineering', level: 75, category: 'Technical' },
                { name: 'System Design & Distributed Data', level: 68, category: 'Analytical' },
                { name: 'Cross-functional Collaboration', level: 80, category: 'Leadership' },
              ].map((skill) => (
                <div key={skill.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{skill.name}</span>
                    <span className="text-purple-400 font-bold">{skill.level}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full" 
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button 
                onClick={() => navigate('/competency-profile')}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-purple-300 border border-purple-500/20 transition-colors"
              >
                <span>Explore Full Competency Passport</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 3: Security & Preferences */}
      {activeTab === 'security' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Password Change Card */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <KeyRound size={18} className="text-purple-400" /> Change Password
            </h3>

            {passSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>{passSuccess}</span>
              </div>
            )}

            {passError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{passError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    placeholder="Enter current password"
                    className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  New Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="At least 8 characters"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Re-enter new password"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                disabled={isChangingPass || !currentPassword || !newPassword}
                className="w-full py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm shadow-md shadow-purple-600/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Lock size={15} />
                {isChangingPass ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>

          {/* Preferences & Active Session */}
          <div className="space-y-6">
            {/* Notification toggles */}
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Bell size={18} className="text-purple-400" /> Notifications & Alerts
              </h3>

              <div className="space-y-3 text-xs">
                <label className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-white/[0.04]">
                  <div>
                    <span className="font-semibold text-slate-200 block">Email Notifications</span>
                    <span className="text-slate-400">Receive assessment results and announcements</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-600 text-purple-600 focus:ring-purple-600"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-white/[0.04]">
                  <div>
                    <span className="font-semibold text-slate-200 block">Course & Goal Reminders</span>
                    <span className="text-slate-400">Keep learning streak alive with friendly nudges</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={courseReminders}
                    onChange={(e) => setCourseReminders(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-600 text-purple-600 focus:ring-purple-600"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-white/[0.04]">
                  <div>
                    <span className="font-semibold text-slate-200 block">Weekly Capability Digest</span>
                    <span className="text-slate-400">Summary of skill enhancements & rank</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={weeklyDigest}
                    onChange={(e) => setWeeklyDigest(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-600 text-purple-600 focus:ring-purple-600"
                  />
                </label>
              </div>
            </div>

            {/* Session Security */}
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Globe size={18} className="text-purple-400" /> Active Session
              </h3>
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Smartphone size={16} />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-200 block">Current Web Client</span>
                    <span className="text-slate-400">Active now  Authenticated via Token</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                  Online
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 4: Activity & Badges */}
      {activeTab === 'activity' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center mb-2">
                <Trophy size={24} />
              </div>
              <span className="text-2xl font-bold text-white block">2,450 XP</span>
              <span className="text-xs text-slate-400">Total Capability Experience</span>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2">
                <Flame size={24} />
              </div>
              <span className="text-2xl font-bold text-white block">12 Days</span>
              <span className="text-xs text-slate-400">Current Learning Streak</span>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
                <Award size={24} />
              </div>
              <span className="text-2xl font-bold text-white block">Level 12</span>
              <span className="text-xs text-slate-400">Mastery Rank</span>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles size={18} className="text-purple-400" /> Recent Accomplishments
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { title: 'Full Stack Master', date: 'Aug 2026', desc: 'Completed 5 advanced engineering modules with >85% score.' },
                { title: 'Consistency Champion', date: 'Jul 2026', desc: 'Maintained 10+ consecutive days of verified learning.' },
                { title: 'Architecture Fast-Tracker', date: 'Jun 2026', desc: 'Passed the Distributed Systems Capability Benchmark.' },
                { title: 'Competency Pioneer', date: 'May 2026', desc: 'Completed baseline diagnostic capability assessment.' },
              ].map((item) => (
                <div key={item.title} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center shrink-0">
                    <Zap size={20} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-200">{item.title}</h4>
                      <span className="text-[10px] text-slate-500">{item.date}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* GitHub-style Learning Activity Heatmap */}
          {user?.id && <ActivityHeatmap userId={user.id} theme="dark" />}
        </motion.div>
      )}

      {/* Project Modal */}
      <ProjectModal
        isOpen={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        project={selectedProject}
        onSuccess={handleProjectSuccess}
        onDelete={handleProjectDelete}
      />

      {/* Project Interactive Preview Modal */}
      <ProjectPreviewModal
        isOpen={!!previewProject}
        onClose={() => setPreviewProject(null)}
        project={previewProject}
        authorName={name || user?.name}
        authorAvatar={avatar || user?.avatar}
        isOwner={true}
        onEdit={(proj) => {
          setPreviewProject(null);
          handleOpenEditProject(proj);
        }}
      />

      {/* Request Recommendation Modal */}
      <RequestRecommendationModal
        isOpen={requestRecModalOpen}
        onClose={() => setRequestRecModalOpen(false)}
        currentUserId={user?.id || ''}
        onSuccess={() => {
          // Re-fetch given recommendations if needed
          userApi.getGivenRecommendations().then((res) => {
            if (res.data?.recommendations) {
              setGivenRecommendations(res.data.recommendations);
            }
          });
        }}
      />

      {/* Followers / Following Modal */}
      <FollowListModal
        isOpen={followModalOpen}
        onClose={() => setFollowModalOpen(false)}
        title={followModalType === 'followers' ? 'Followers' : 'Following'}
        users={followModalUsers}
        loading={followModalLoading}
        onFollowToggle={(userId, status) => {
          if (followModalType === 'following') {
            setFollowingCount((prev) => (status ? prev + 1 : Math.max(0, prev - 1)));
          }
        }}
      />
    </div>
  );
};

export const UserProfile = ({ defaultTab }: { defaultTab?: string }) => {
  const user = useAuthStore((state) => state.user);

  // Render within the appropriate role layout
  if (user?.role === 'TRAINER') {
    return (
      <TrainerLayout>
        <UserProfileView defaultTab={defaultTab} />
      </TrainerLayout>
    );
  }

  if (user?.role === 'MANAGER' || user?.role === 'ADMIN') {
    return (
      <ManagerLayout>
        <UserProfileView defaultTab={defaultTab} />
      </ManagerLayout>
    );
  }

  return (
    <AppShell>
      <UserProfileView defaultTab={defaultTab} />
    </AppShell>
  );
};
