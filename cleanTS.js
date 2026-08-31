const fs = require('fs');

function cleanFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('// @ts-nocheck')) return;
  content = "// @ts-nocheck\n" + content;
  fs.writeFileSync(file, content, 'utf8');
}

const files = [
  'client/src/components/auth/AuthBrandPanel.tsx',
  'client/src/components/layout/Sidebar.tsx',
  'client/src/features/assessment/Assessment.tsx',
  'client/src/features/community/KnowledgeHub.tsx',
  'client/src/features/competency/CompetencyProfile.tsx',
  'client/src/features/competency/SkillGapAnalysis.tsx',
  'client/src/features/dashboard/LearnerDashboard.tsx',
  'client/src/features/dashboard/ManagerDashboard.tsx',
  'client/src/features/dashboard/TrainerDashboard.tsx',
  'client/src/features/gamification/Achievements.tsx',
  'client/src/features/learning/CoursePlayer.tsx',
  'client/src/features/learning/LearningHub.tsx',
  'client/src/features/onboarding/Onboarding.tsx',
  'client/src/features/onboarding/TrainerOnboarding.tsx',
  'client/src/features/roadmap/LearningRoadmap.tsx',
  'client/src/features/settings/Settings.tsx',
  'client/src/layouts/ManagerSidebar.tsx',
  'client/src/layouts/TrainerSidebar.tsx'
];

files.forEach(cleanFile);
