const fs = require('fs');
let content = fs.readFileSync('shared/index.ts', 'utf8');
content = content.replace(/profile\?: UserProfile;/, 
`profile?: UserProfile;
  profileCompleted?: boolean;
  learnerAssessmentCompleted?: boolean;
  trainerOnboardingCompleted?: boolean;`);
fs.writeFileSync('shared/index.ts', content, 'utf8');
