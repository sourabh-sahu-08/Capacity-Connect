const fs = require('fs');
let content = fs.readFileSync('server/models/User.ts', 'utf8');

content = content.replace(
  /trainerOnboardingCompleted: { type: Boolean, default: false }/,
  `trainerOnboardingCompleted: { type: Boolean, default: false },
  resetPasswordToken: String,
  resetPasswordExpire: Date`
);

fs.writeFileSync('server/models/User.ts', content, 'utf8');
