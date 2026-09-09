// @ts-nocheck
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Layouts (small — load eagerly so shell never flashes)
import { AppShell } from './components/layout/AppShell';
import { TrainerLayout } from './layouts/TrainerLayout';
import { ManagerLayout } from './layouts/ManagerLayout';
import { NotificationProvider } from './features/notifications/NotificationProvider';

// ─── Lazy-loaded route components ───────────────────────────────────────────
// Auth
const Login = lazy(() => import('./features/auth/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('./features/auth/Register').then(m => ({ default: m.Register })));
const ForgotPassword = lazy(() => import('./features/auth/ForgotPassword').then(m => ({ default: m.ForgotPassword })));
const ResetPassword = lazy(() => import('./features/auth/ResetPassword').then(m => ({ default: m.ResetPassword })));
const Landing = lazy(() => import('./features/marketing/Landing').then(m => ({ default: m.Landing })));

// Onboarding
const TrainerOnboarding = lazy(() => import('./features/onboarding/TrainerOnboarding').then(m => ({ default: m.TrainerOnboarding })));
const Onboarding = lazy(() => import('./features/onboarding/Onboarding').then(m => ({ default: m.Onboarding })));

// Learner
const LearnerDashboard = lazy(() => import('./features/dashboard/LearnerDashboard').then(m => ({ default: m.LearnerDashboard })));
const LearningHub = lazy(() => import('./features/learning/LearningHub').then(m => ({ default: m.LearningHub })));
const CoursePlayer = lazy(() => import('./features/learning/CoursePlayer').then(m => ({ default: m.CoursePlayer })));
const Assessment = lazy(() => import('./features/assessment/Assessment').then(m => ({ default: m.Assessment })));
const CompetencyProfile = lazy(() => import('./features/competency/CompetencyProfile').then(m => ({ default: m.CompetencyProfile })));
const SkillGapAnalysis = lazy(() => import('./features/competency/SkillGapAnalysis').then(m => ({ default: m.SkillGapAnalysis })));
const Achievements = lazy(() => import('./features/gamification/Achievements').then(m => ({ default: m.Achievements })));
const NotificationCenter = lazy(() => import('./features/notifications/NotificationCenter').then(m => ({ default: m.NotificationCenter })));
const UserProfile = lazy(() => import('./features/profile/UserProfile').then(m => ({ default: m.UserProfile })));
const PublicProfile = lazy(() => import('./features/profile/PublicProfile').then(m => ({ default: m.PublicProfile })));
const DiscoverNetwork = lazy(() => import('./features/network/DiscoverNetwork').then(m => ({ default: m.DiscoverNetwork })));

// Trainer
const TrainerOverview = lazy(() => import('./features/trainer/TrainerOverview').then(m => ({ default: m.TrainerOverview })));
const LearnersList = lazy(() => import('./features/trainer/LearnersList').then(m => ({ default: m.LearnersList })));
const LearnerDetail = lazy(() => import('./features/trainer/LearnerDetail').then(m => ({ default: m.LearnerDetail })));
const CoursesList = lazy(() => import('./features/trainer/CoursesList').then(m => ({ default: m.CoursesList })));
const CourseDetail = lazy(() => import('./features/trainer/CourseDetail').then(m => ({ default: m.CourseDetail })));
const AssessmentsList = lazy(() => import('./features/trainer/AssessmentsList').then(m => ({ default: m.AssessmentsList })));
const AssessmentDetail = lazy(() => import('./features/trainer/AssessmentDetail').then(m => ({ default: m.AssessmentDetail })));
const TrainerAnalytics = lazy(() => import('./features/trainer/TrainerAnalytics').then(m => ({ default: m.TrainerAnalytics })));
const TrainerInsights = lazy(() => import('./features/trainer/TrainerInsights').then(m => ({ default: m.TrainerInsights })));

// Manager
const ManagerOverview = lazy(() => import('./features/manager/ManagerOverview').then(m => ({ default: m.ManagerOverview })));
const TeamsList = lazy(() => import('./features/manager/TeamsList').then(m => ({ default: m.TeamsList })));
const TeamDetail = lazy(() => import('./features/manager/TeamDetail').then(m => ({ default: m.TeamDetail })));
const CapabilityIntelligence = lazy(() => import('./features/manager/CapabilityIntelligence').then(m => ({ default: m.CapabilityIntelligence })));
const SkillGaps = lazy(() => import('./features/manager/SkillGaps').then(m => ({ default: m.SkillGaps })));
const ManagerAnalytics = lazy(() => import('./features/manager/ManagerAnalytics').then(m => ({ default: m.ManagerAnalytics })));
const ReadinessPlanning = lazy(() => import('./features/manager/ReadinessPlanning').then(m => ({ default: m.ReadinessPlanning })));
const Reports = lazy(() => import('./features/manager/Reports').then(m => ({ default: m.Reports })));

// ─── Route fallback spinner ──────────────────────────────────────────────────
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#050505]">
    <div className="w-10 h-10 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
  </div>
);

// ─── Auth Guards ─────────────────────────────────────────────────────────────
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useAuthStore((state) => state.token);
  const location = useLocation();
  if (!token) return <Navigate to="/login" state={{ from: location }} replace />;
  return <NotificationProvider>{children}</NotificationProvider>;
};

const TraineeRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthStore((state) => state.user);
  if (!user || user.role !== 'LEARNER') return <Navigate to="/" replace />;
  return <>{children}</>;
};

const TrainerRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthStore((state) => state.user);
  if (!user || user.role !== 'TRAINER') return <Navigate to="/" replace />;
  return <TrainerLayout>{children}</TrainerLayout>;
};

const ManagerRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthStore((state) => state.user);
  if (!user || (user.role !== 'MANAGER' && user.role !== 'ADMIN')) return <Navigate to="/" replace />;
  return <ManagerLayout>{children}</ManagerLayout>;
};

const IndexRedirect = () => {
  const user = useAuthStore((state) => state.user);
  if (!user) return <Landing />;
  if (user.role === 'LEARNER') return user.learnerAssessmentCompleted ? <Navigate to="/dashboard" replace /> : <Navigate to="/onboarding" replace />;
  if (user.role === 'TRAINER') return user.trainerOnboardingCompleted ? <Navigate to="/trainer/dashboard" replace /> : <Navigate to="/onboarding-trainer" replace />;
  if (user.role === 'MANAGER' || user.role === 'ADMIN') return <Navigate to="/manager/dashboard" replace />;
  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/home" element={<Landing />} />

          {/* Root */}
          <Route path="/" element={<IndexRedirect />} />

          {/* Legacy redirects */}
          <Route path="/trainer-dashboard" element={<Navigate to="/trainer/dashboard" replace />} />
          <Route path="/manager-dashboard" element={<Navigate to="/manager/dashboard" replace />} />

          {/* Onboarding */}
          <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
          <Route path="/onboarding-trainer" element={<ProtectedRoute><TrainerOnboarding /></ProtectedRoute>} />

          {/* Learner */}
          <Route path="/dashboard" element={<ProtectedRoute><TraineeRoute><AppShell><LearnerDashboard /></AppShell></TraineeRoute></ProtectedRoute>} />
          <Route path="/learner/dashboard" element={<ProtectedRoute><TraineeRoute><AppShell><LearnerDashboard /></AppShell></TraineeRoute></ProtectedRoute>} />
          <Route path="/learning-hub" element={<ProtectedRoute><TraineeRoute><AppShell><LearningHub /></AppShell></TraineeRoute></ProtectedRoute>} />
          <Route path="/course/:id" element={<ProtectedRoute><TraineeRoute><AppShell><CoursePlayer /></AppShell></TraineeRoute></ProtectedRoute>} />
          <Route path="/courses/:id" element={<ProtectedRoute><TraineeRoute><AppShell><CoursePlayer /></AppShell></TraineeRoute></ProtectedRoute>} />
          <Route path="/assessment/:id" element={<ProtectedRoute><TraineeRoute><AppShell><Assessment /></AppShell></TraineeRoute></ProtectedRoute>} />
          <Route path="/competency-profile" element={<ProtectedRoute><TraineeRoute><AppShell><CompetencyProfile /></AppShell></TraineeRoute></ProtectedRoute>} />
          <Route path="/skill-gap" element={<ProtectedRoute><TraineeRoute><AppShell><SkillGapAnalysis /></AppShell></TraineeRoute></ProtectedRoute>} />
          <Route path="/achievements" element={<ProtectedRoute><TraineeRoute><AppShell><Achievements /></AppShell></TraineeRoute></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><TraineeRoute><AppShell><Achievements /></AppShell></TraineeRoute></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><AppShell><NotificationCenter /></AppShell></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          <Route path="/profile/:id" element={<ProtectedRoute><PublicProfile /></ProtectedRoute>} />
          <Route path="/network" element={<ProtectedRoute><DiscoverNetwork /></ProtectedRoute>} />
          <Route path="/discover" element={<ProtectedRoute><DiscoverNetwork /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><UserProfile defaultTab="security" /></ProtectedRoute>} />

          {/* Trainer */}
          <Route path="/trainer">
            <Route path="dashboard" element={<ProtectedRoute><TrainerRoute><TrainerOverview /></TrainerRoute></ProtectedRoute>} />
            <Route path="learners" element={<ProtectedRoute><TrainerRoute><LearnersList /></TrainerRoute></ProtectedRoute>} />
            <Route path="learners/:id" element={<ProtectedRoute><TrainerRoute><LearnerDetail /></TrainerRoute></ProtectedRoute>} />
            <Route path="courses" element={<ProtectedRoute><TrainerRoute><CoursesList /></TrainerRoute></ProtectedRoute>} />
            <Route path="courses/:id" element={<ProtectedRoute><TrainerRoute><CourseDetail /></TrainerRoute></ProtectedRoute>} />
            <Route path="assessments" element={<ProtectedRoute><TrainerRoute><AssessmentsList /></TrainerRoute></ProtectedRoute>} />
            <Route path="assessments/:id" element={<ProtectedRoute><TrainerRoute><AssessmentDetail /></TrainerRoute></ProtectedRoute>} />
            <Route path="notifications" element={<ProtectedRoute><TrainerRoute><NotificationCenter /></TrainerRoute></ProtectedRoute>} />
            <Route path="analytics" element={<ProtectedRoute><TrainerRoute><TrainerAnalytics /></TrainerRoute></ProtectedRoute>} />
            <Route path="insights" element={<ProtectedRoute><TrainerRoute><TrainerInsights /></TrainerRoute></ProtectedRoute>} />
          </Route>

          {/* Manager */}
          <Route path="/manager">
            <Route path="dashboard" element={<ProtectedRoute><ManagerRoute><ManagerOverview /></ManagerRoute></ProtectedRoute>} />
            <Route path="teams" element={<ProtectedRoute><ManagerRoute><TeamsList /></ManagerRoute></ProtectedRoute>} />
            <Route path="teams/:id" element={<ProtectedRoute><ManagerRoute><TeamDetail /></ManagerRoute></ProtectedRoute>} />
            <Route path="capabilities" element={<ProtectedRoute><ManagerRoute><CapabilityIntelligence /></ManagerRoute></ProtectedRoute>} />
            <Route path="skill-gaps" element={<ProtectedRoute><ManagerRoute><SkillGaps /></ManagerRoute></ProtectedRoute>} />
            <Route path="notifications" element={<ProtectedRoute><ManagerRoute><NotificationCenter /></ManagerRoute></ProtectedRoute>} />
            <Route path="analytics" element={<ProtectedRoute><ManagerRoute><ManagerAnalytics /></ManagerRoute></ProtectedRoute>} />
            <Route path="readiness" element={<ProtectedRoute><ManagerRoute><ReadinessPlanning /></ManagerRoute></ProtectedRoute>} />
            <Route path="reports" element={<ProtectedRoute><ManagerRoute><Reports /></ManagerRoute></ProtectedRoute>} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
