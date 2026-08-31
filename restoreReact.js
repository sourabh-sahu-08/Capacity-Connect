const fs = require('fs');

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
  'client/src/features/manager/CapabilityIntelligence.tsx',
  'client/src/features/manager/ManagerAnalytics.tsx',
  'client/src/features/manager/ManagerOverview.tsx',
  'client/src/features/manager/ReadinessPlanning.tsx',
  'client/src/features/manager/Reports.tsx',
  'client/src/features/manager/SkillGaps.tsx',
  'client/src/features/manager/TeamDetail.tsx',
  'client/src/features/manager/TeamsList.tsx',
  'client/src/features/onboarding/Onboarding.tsx',
  'client/src/features/onboarding/TrainerOnboarding.tsx',
  'client/src/features/roadmap/LearningRoadmap.tsx',
  'client/src/features/settings/Settings.tsx',
  'client/src/features/trainer/AssessmentDetail.tsx',
  'client/src/features/trainer/AssessmentsList.tsx',
  'client/src/features/trainer/CourseDetail.tsx',
  'client/src/features/trainer/CoursesList.tsx',
  'client/src/features/trainer/LearnerDetail.tsx',
  'client/src/features/trainer/LearnersList.tsx',
  'client/src/features/trainer/TrainerAnalytics.tsx',
  'client/src/features/trainer/TrainerInsights.tsx',
  'client/src/features/trainer/TrainerOverview.tsx',
  'client/src/layouts/ManagerSidebar.tsx',
  'client/src/layouts/TrainerSidebar.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes("'react'") && !content.includes('"react"')) {
    let imports = ['React'];
    if (content.includes('useState')) imports.push('useState');
    if (content.includes('useEffect')) imports.push('useEffect');
    if (content.includes('useRef')) imports.push('useRef');
    if (content.includes('useMemo')) imports.push('useMemo');
    if (content.includes('useCallback')) imports.push('useCallback');
    
    let importString = `import ${imports.shift()}${imports.length ? `, { ${imports.join(', ')} }` : ''} from 'react';\n`;
    content = content.replace('// @ts-nocheck\n', '// @ts-nocheck\n' + importString);
    fs.writeFileSync(file, content, 'utf8');
  }
});
