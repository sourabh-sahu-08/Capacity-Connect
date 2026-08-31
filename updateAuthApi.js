const fs = require('fs');
let content = fs.readFileSync('client/src/api/auth.api.ts', 'utf8');

content = content.replace(
  /getMe: \(\) => api\.get\('\/api\/auth\/me'\),/,
  `getMe: () => api.get('/api/auth/me'),
  forgotPassword: (data: { email: string }) => api.post('/api/auth/forgot-password', data),
  resetPassword: (token: string, data: { password: string }) => api.post(\`/api/auth/reset-password/\${token}\`, data),`
);

fs.writeFileSync('client/src/api/auth.api.ts', content, 'utf8');
