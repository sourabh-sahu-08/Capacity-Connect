const fs = require('fs');

const createStub = (name) => `import React from 'react';
export const ${name} = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">${name}</h1>
      <p className="text-slate-500 mt-2">This is a dedicated page for ${name}.</p>
    </div>
  );
};
`;

const trainerFiles = ['TrainerOverview', 'LearnersList', 'LearnerDetail', 'CoursesList', 'CourseDetail', 'AssessmentsList', 'AssessmentDetail', 'TrainerAnalytics', 'TrainerInsights'];
trainerFiles.forEach(f => fs.writeFileSync(`client/src/features/trainer/${f}.tsx`, createStub(f), 'utf8'));

const managerFiles = ['ManagerOverview', 'TeamsList', 'TeamDetail', 'CapabilityIntelligence', 'SkillGaps', 'ManagerAnalytics', 'ReadinessPlanning', 'Reports'];
managerFiles.forEach(f => fs.writeFileSync(`client/src/features/manager/${f}.tsx`, createStub(f), 'utf8'));

