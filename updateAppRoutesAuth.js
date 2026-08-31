const fs = require('fs');
let content = fs.readFileSync('client/src/App.tsx', 'utf8');

// Add imports
content = content.replace(
  /import { Register } from '.\/features\/auth\/Register';/,
  `import { Register } from './features/auth/Register';\nimport { ForgotPassword } from './features/auth/ForgotPassword';\nimport { ResetPassword } from './features/auth/ResetPassword';`
);

// Add routes
content = content.replace(
  /<Route path="\/register" element={<Register \/>} \/>/,
  `<Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />`
);

fs.writeFileSync('client/src/App.tsx', content, 'utf8');
