const fs = require('fs');
let content = fs.readFileSync('server/models/User.ts', 'utf8');
content = content.replace(/isOnboarded: { type: Boolean, default: false }/, 
`profileCompleted: { type: Boolean, default: false },
  learnerAssessmentCompleted: { type: Boolean, default: false },
  trainerOnboardingCompleted: { type: Boolean, default: false }`);
fs.writeFileSync('server/models/User.ts', content, 'utf8');
