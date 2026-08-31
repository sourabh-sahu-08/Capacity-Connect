const fs = require('fs');
let content = fs.readFileSync('client/src/features/auth/Login.tsx', 'utf8');

content = content.replace(/if \(response\.data\.role === 'MANAGER' \|\| response\.data\.role === 'ADMIN'\) \{[\s\S]*?\} else \{[\s\S]*?\}/, 
`if (response.data.role === 'MANAGER' || response.data.role === 'ADMIN') {
        navigate('/manager-dashboard');
      } else if (response.data.role === 'TRAINER') {
        if (response.data.trainerOnboardingCompleted === false) {
          navigate('/onboarding-trainer');
        } else {
          navigate('/trainer-dashboard');
        }
      } else {
        if (response.data.learnerAssessmentCompleted === false) {
          navigate('/onboarding');
        } else {
          navigate('/dashboard');
        }
      }`);

fs.writeFileSync('client/src/features/auth/Login.tsx', content, 'utf8');
