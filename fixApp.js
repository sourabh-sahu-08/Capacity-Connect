const fs = require('fs');

let shared = fs.readFileSync('shared/index.ts', 'utf8');
if (!shared.includes('learnerAssessmentCompleted')) {
  shared = shared.replace(/export interface User \{/, "export interface User {\n  learnerAssessmentCompleted?: boolean;\n  trainerOnboardingCompleted?: boolean;");
  fs.writeFileSync('shared/index.ts', shared, 'utf8');
}

let app = fs.readFileSync('client/src/App.tsx', 'utf8');
app = app.replace("import { QueryClient, QueryClientProvider } from '@tanstack/react-query';\n", "");
app = app.replace("const queryClient = new QueryClient();\n", "");
app = app.replace("<QueryClientProvider client={queryClient}>\n", "");
app = app.replace("    </QueryClientProvider>\n", "");

app = app.replace("'./features/onboarding/Assessment'", "'./features/assessment/Assessment'");
app = app.replace("import { Dashboard } from './features/dashboard/Dashboard';", "import { LearnerDashboard as Dashboard } from './features/dashboard/LearnerDashboard';");
app = app.replace("'./features/profile/CompetencyProfile'", "'./features/competency/CompetencyProfile'");
app = app.replace("'./features/intelligence/SkillGapAnalysis'", "'./features/competency/SkillGapAnalysis'");
app = app.replace("'./features/achievements/Achievements'", "'./features/gamification/Achievements'");

fs.writeFileSync('client/src/App.tsx', app, 'utf8');

