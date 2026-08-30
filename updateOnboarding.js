const fs = require('fs');
let content = fs.readFileSync('client/src/features/onboarding/Onboarding.tsx', 'utf8');
content = content.replace(
  "if (userRole === 'MANAGER' || userRole === 'TRAINER' || userRole === 'ADMIN') {\n      navigate('/manager-dashboard');",
  "if (userRole === 'MANAGER' || userRole === 'ADMIN') {\n      navigate('/manager-dashboard');\n    } else if (userRole === 'TRAINER') {\n      navigate('/trainer-dashboard');"
);
content = content.replace(
  "if (userRole === 'MANAGER' || userRole === 'TRAINER' || userRole === 'ADMIN') {\r\n      navigate('/manager-dashboard');",
  "if (userRole === 'MANAGER' || userRole === 'ADMIN') {\r\n      navigate('/manager-dashboard');\r\n    } else if (userRole === 'TRAINER') {\r\n      navigate('/trainer-dashboard');"
);
fs.writeFileSync('client/src/features/onboarding/Onboarding.tsx', content, 'utf8');
