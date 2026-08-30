const fs = require('fs');
let content = fs.readFileSync('client/src/features/auth/Login.tsx', 'utf8');
content = content.replace(
  "if (response.data.role === 'MANAGER' || response.data.role === 'TRAINER' || response.data.role === 'ADMIN') {\n        navigate('/manager-dashboard');",
  "if (response.data.role === 'MANAGER' || response.data.role === 'ADMIN') {\n        navigate('/manager-dashboard');\n      } else if (response.data.role === 'TRAINER') {\n        navigate('/trainer-dashboard');"
);
content = content.replace(
  "if (response.data.role === 'MANAGER' || response.data.role === 'TRAINER' || response.data.role === 'ADMIN') {\r\n        navigate('/manager-dashboard');",
  "if (response.data.role === 'MANAGER' || response.data.role === 'ADMIN') {\r\n        navigate('/manager-dashboard');\r\n      } else if (response.data.role === 'TRAINER') {\r\n        navigate('/trainer-dashboard');"
);
fs.writeFileSync('client/src/features/auth/Login.tsx', content, 'utf8');
