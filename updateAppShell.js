const fs = require('fs');
let content = fs.readFileSync('client/src/components/layout/AppShell.tsx', 'utf8');
content = content.replace(
  /<span className="text-2xl group-hover:scale-110 transition-transform">\?<\/span>/g,
  `<span className="text-2xl group-hover:scale-110 transition-transform">✦</span>`
);
fs.writeFileSync('client/src/components/layout/AppShell.tsx', content, 'utf8');
