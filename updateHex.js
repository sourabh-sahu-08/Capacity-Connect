const fs = require('fs');
let content = fs.readFileSync('client/src/features/competency/CompetencyProfile.tsx', 'utf8');
content = content.replace(/#4f46e5/gi, '#9333ea');
fs.writeFileSync('client/src/features/competency/CompetencyProfile.tsx', content, 'utf8');
