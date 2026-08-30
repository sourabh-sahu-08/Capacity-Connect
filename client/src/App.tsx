import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './features/auth/Login';
import { Register } from './features/auth/Register';
import { Onboarding } from './features/onboarding/Onboarding';
import { CompetencyProfile } from './features/competency/CompetencyProfile';
import { SkillGapAnalysis } from './features/competency/SkillGapAnalysis';
import { LearningRoadmap } from './features/roadmap/LearningRoadmap';
import { Assessment } from './features/assessment/Assessment';
import { KnowledgeHub } from './features/community/KnowledgeHub';
import { Achievements } from './features/gamification/Achievements';
import { LearningHub } from './features/learning/LearningHub';
import { CoursePlayer } from './features/learning/CoursePlayer';
import { LearnerDashboard } from './features/dashboard/LearnerDashboard';
import { ManagerDashboard } from './features/dashboard/ManagerDashboard';
import { TrainerDashboard } from './features/dashboard/TrainerDashboard';
import { Settings } from './features/settings/Settings';
import { AppShell } from './components/layout/AppShell';
import { useAuthStore } from './store/authStore';

const IndexRedirect = () => {
  const user = useAuthStore((state) => state.user);
  if (!user) return <Navigate to="/login" />;
  if (user.role === "MANAGER" || user.role === "ADMIN") {
    return <Navigate to="/manager-dashboard" />;
  }
  if (user.role === "TRAINER") {
    return <Navigate to="/trainer-dashboard" />;
  }
  return <Navigate to="/dashboard" />;
};

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <AppShell>{children}</AppShell> : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500/30">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/onboarding" 
            element={
              useAuthStore().isAuthenticated ? <Onboarding /> : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <LearnerDashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/trainer-dashboard" 
            element={
              <PrivateRoute>
                <TrainerDashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/manager-dashboard" 
            element={
              <PrivateRoute>
                <ManagerDashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/competency-profile" 
            element={
              <PrivateRoute>
                <CompetencyProfile />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/skill-gap" 
            element={
              <PrivateRoute>
                <SkillGapAnalysis />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/roadmap" 
            element={
              <PrivateRoute>
                <LearningRoadmap />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/learning-hub" 
            element={
              <PrivateRoute>
                <LearningHub />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/course/:id" 
            element={
              <PrivateRoute>
                <CoursePlayer />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/assessments" 
            element={
              <PrivateRoute>
                <Assessment />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/knowledge-hub" 
            element={
              <PrivateRoute>
                <KnowledgeHub />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/achievements" 
            element={
              <PrivateRoute>
                <Achievements />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            } 
          />
          <Route path="/" element={<IndexRedirect />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
