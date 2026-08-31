// @ts-nocheck
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Layouts
import { AppShell } from './components/layout/AppShell';
import { TrainerLayout } from './layouts/TrainerLayout';
import { ManagerLayout } from './layouts/ManagerLayout';

// Auth Components
import { Login } from './features/auth/Login';
import { Register } from './features/auth/Register';
import { ForgotPassword } from './features/auth/ForgotPassword';
import { ResetPassword } from './features/auth/ResetPassword';
import { Landing } from './features/marketing/Landing';
import { TrainerOnboarding } from './features/onboarding/TrainerOnboarding';
import { Assessment } from './features/assessment/Assessment';
import { Onboarding } from './features/onboarding/Onboarding';

// Trainee Components
import { LearnerDashboard as Dashboard } from './features/dashboard/LearnerDashboard';
import { LearningHub } from './features/learning/LearningHub';
import { CoursePlayer } from './features/learning/CoursePlayer';
import { CompetencyProfile } from './features/competency/CompetencyProfile';
import { SkillGapAnalysis } from './features/competency/SkillGapAnalysis';
import { Achievements } from './features/gamification/Achievements';
import { NotificationProvider } from './features/notifications/NotificationProvider';
import { NotificationCenter } from './features/notifications/NotificationCenter';

// Trainer Components
import { TrainerOverview } from './features/trainer/TrainerOverview';
import { LearnersList } from './features/trainer/LearnersList';
import { LearnerDetail } from './features/trainer/LearnerDetail';
import { CoursesList } from './features/trainer/CoursesList';
import { CourseDetail } from './features/trainer/CourseDetail';
import { AssessmentsList } from './features/trainer/AssessmentsList';
import { AssessmentDetail } from './features/trainer/AssessmentDetail';
import { TrainerAnalytics } from './features/trainer/TrainerAnalytics';
import { TrainerInsights } from './features/trainer/TrainerInsights';

// Manager Components
import { ManagerOverview } from './features/manager/ManagerOverview';
import { TeamsList } from './features/manager/TeamsList';
import { TeamDetail } from './features/manager/TeamDetail';
import { CapabilityIntelligence } from './features/manager/CapabilityIntelligence';
import { SkillGaps } from './features/manager/SkillGaps';
import { ManagerAnalytics } from './features/manager/ManagerAnalytics';
import { ReadinessPlanning } from './features/manager/ReadinessPlanning';
import { Reports } from './features/manager/Reports';


// Auth Guards
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useAuthStore((state) => state.token);
  const location = useLocation();
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <NotificationProvider>{children}</NotificationProvider>;
};

const TraineeRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthStore((state) => state.user);
  if (!user || user.role !== 'LEARNER') {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const TrainerRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthStore((state) => state.user);
  if (!user || user.role !== 'TRAINER') {
    return <Navigate to="/" replace />;
  }
  return <TrainerLayout>{children}</TrainerLayout>;
};

const ManagerRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthStore((state) => state.user);
  if (!user || (user.role !== 'MANAGER' && user.role !== 'ADMIN')) {
    return <Navigate to="/" replace />;
  }
  return <ManagerLayout>{children}</ManagerLayout>;
};

// Index Redirect logic based on role and onboarding status
const IndexRedirect = () => {
  const user = useAuthStore((state) => state.user);
  if (!user) return <Landing />;

  if (user.role === 'LEARNER') {
    return user.learnerAssessmentCompleted ? <Navigate to="/dashboard" replace /> : <Navigate to="/onboarding" replace />;
  } else if (user.role === 'TRAINER') {
    return user.trainerOnboardingCompleted ? <Navigate to="/trainer/dashboard" replace /> : <Navigate to="/onboarding-trainer" replace />;
  } else if (user.role === 'MANAGER' || user.role === 'ADMIN') {
    return <Navigate to="/manager/dashboard" replace />;
  }
  return <Navigate to="/login" replace />;
};

function App() {
  return (
          <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/home" element={<Landing />} />

          {/* Root Redirect */}
          <Route path="/" element={<IndexRedirect />} />
          
          {/* Legacy Redirects */}
          <Route path="/trainer-dashboard" element={<Navigate to="/trainer/dashboard" replace />} />
          <Route path="/manager-dashboard" element={<Navigate to="/manager/dashboard" replace />} />

          {/* Onboarding Routes */}
          <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
          <Route path="/onboarding-trainer" element={<ProtectedRoute><TrainerOnboarding /></ProtectedRoute>} />

          {/* Trainee Routes (using AppShell) */}
          <Route path="/dashboard" element={<ProtectedRoute><TraineeRoute><AppShell><Dashboard /></AppShell></TraineeRoute></ProtectedRoute>} />
          <Route path="/learning-hub" element={<ProtectedRoute><TraineeRoute><AppShell><LearningHub /></AppShell></TraineeRoute></ProtectedRoute>} />
          <Route path="/course/:id" element={<ProtectedRoute><TraineeRoute><AppShell><CoursePlayer /></AppShell></TraineeRoute></ProtectedRoute>} />
          <Route path="/competency-profile" element={<ProtectedRoute><TraineeRoute><AppShell><CompetencyProfile /></AppShell></TraineeRoute></ProtectedRoute>} />
          <Route path="/skill-gap" element={<ProtectedRoute><TraineeRoute><AppShell><SkillGapAnalysis /></AppShell></TraineeRoute></ProtectedRoute>} />
          <Route path="/achievements" element={<ProtectedRoute><TraineeRoute><AppShell><Achievements /></AppShell></TraineeRoute></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><AppShell><NotificationCenter /></AppShell></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><AppShell><div className="p-8">Settings Page Stub</div></AppShell></ProtectedRoute>} />

          {/* Trainer Routes (using TrainerLayout internally) */}
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

          {/* Manager Routes (using ManagerLayout internally) */}
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
      </BrowserRouter>
  );
}

export default App;
