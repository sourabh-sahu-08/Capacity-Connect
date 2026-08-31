const fs = require('fs');

const fixFile = (path) => {
  let content = fs.readFileSync(path, 'utf8');
  content = content.replace(/'\/trainer-dashboard'/g, "'/trainer/dashboard'");
  content = content.replace(/'\/manager-dashboard'/g, "'/manager/dashboard'");
  fs.writeFileSync(path, content, 'utf8');
};

fixFile('client/src/features/auth/Login.tsx');
fixFile('client/src/features/auth/Register.tsx');
fixFile('client/src/features/onboarding/TrainerOnboarding.tsx');

