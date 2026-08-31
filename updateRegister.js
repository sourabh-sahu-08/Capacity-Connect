const fs = require('fs');
let content = fs.readFileSync('client/src/features/auth/Register.tsx', 'utf8');

content = content.replace(/navigate\('\/onboarding'\);/, 
`if (response.data.role === 'MANAGER' || response.data.role === 'ADMIN') {
        navigate('/manager-dashboard');
      } else if (response.data.role === 'TRAINER') {
        navigate('/onboarding-trainer');
      } else {
        navigate('/onboarding');
      }`);

fs.writeFileSync('client/src/features/auth/Register.tsx', content, 'utf8');
