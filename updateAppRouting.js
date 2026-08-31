const fs = require('fs');
let content = fs.readFileSync('client/src/App.tsx', 'utf8');

// Import TrainerOnboarding
content = content.replace(/import { Onboarding } from '.\/features\/onboarding\/Onboarding';/, 
`import { Onboarding } from './features/onboarding/Onboarding';\nimport { TrainerOnboarding } from './features/onboarding/TrainerOnboarding';`);

// Add Route for /onboarding-trainer
content = content.replace(/<Route\s*path="\/onboarding"[\s\S]*?\/>/, 
`<Route 
            path="/onboarding" 
            element={
              useAuthStore().isAuthenticated ? <Onboarding /> : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/onboarding-trainer" 
            element={
              useAuthStore().isAuthenticated ? <TrainerOnboarding /> : <Navigate to="/login" />
            } 
          />`);

// Update IndexRedirect
content = content.replace(/const IndexRedirect = \(\) => {[\s\S]*?};/, 
`const IndexRedirect = () => {
  const user = useAuthStore((state) => state.user);
  if (!user) return <Navigate to="/login" />;
  if (user.role === "MANAGER" || user.role === "ADMIN") {
    return <Navigate to="/manager-dashboard" />;
  }
  if (user.role === "TRAINER") {
    if (user.trainerOnboardingCompleted === false) return <Navigate to="/onboarding-trainer" />;
    return <Navigate to="/trainer-dashboard" />;
  }
  if (user.learnerAssessmentCompleted === false) return <Navigate to="/onboarding" />;
  return <Navigate to="/dashboard" />;
};`);

fs.writeFileSync('client/src/App.tsx', content, 'utf8');
