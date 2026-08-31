const fs = require('fs');
let content = fs.readFileSync('server/controllers/onboardingController.ts', 'utf8');

content = content.replace(/isOnboarded: true/, 'learnerAssessmentCompleted: true');

fs.writeFileSync('server/controllers/onboardingController.ts', content, 'utf8');
