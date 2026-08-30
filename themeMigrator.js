const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const dirFile = path.join(dir, file);
    const dirent = fs.statSync(dirFile);
    if (dirent.isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (dirFile.endsWith('.tsx') || dirFile.endsWith('.ts') || dirFile.endsWith('.css')) {
        filelist.push(dirFile);
      }
    }
  }
  return filelist;
};

const replacements = [
  // Backgrounds
  { from: /bg-zinc-950/g, to: 'bg-slate-50' },
  { from: /bg-zinc-900/g, to: 'bg-white' },
  { from: /bg-zinc-800\/50/g, to: 'bg-slate-50' },
  { from: /bg-zinc-800\/80/g, to: 'bg-white' },
  { from: /bg-zinc-800\/20/g, to: 'bg-slate-50' },
  { from: /bg-zinc-800/g, to: 'bg-slate-100' },
  { from: /bg-zinc-700/g, to: 'bg-slate-200' },
  
  // Text colors
  { from: /text-white/g, to: 'text-slate-900' },
  { from: /text-zinc-50/g, to: 'text-slate-900' },
  { from: /text-zinc-200/g, to: 'text-slate-800' },
  { from: /text-zinc-300/g, to: 'text-slate-700' },
  { from: /text-zinc-400/g, to: 'text-slate-600' },
  { from: /text-zinc-500/g, to: 'text-slate-500' },

  // Borders
  { from: /border-white\/10/g, to: 'border-slate-200' },
  { from: /border-white\/5/g, to: 'border-slate-100' },
  { from: /border-zinc-800/g, to: 'border-slate-200' },
  { from: /border-zinc-700/g, to: 'border-slate-300' },

  // Hover states
  { from: /hover:bg-zinc-800/g, to: 'hover:bg-slate-50' },
  { from: /hover:bg-white\/5/g, to: 'hover:bg-slate-50' },
  { from: /hover:bg-zinc-700/g, to: 'hover:bg-slate-100' },

  // Specific AI / Highlights (Indigo/Violet)
  { from: /bg-indigo-500\/10/g, to: 'bg-indigo-50' },
  { from: /bg-indigo-500\/20/g, to: 'bg-indigo-100' },
  { from: /bg-purple-900\/30/g, to: 'bg-violet-50' },
  { from: /bg-purple-500\/10/g, to: 'bg-violet-50' },
  { from: /border-purple-500\/30/g, to: 'border-violet-200' },
  { from: /text-purple-400/g, to: 'text-violet-600' },
  { from: /text-indigo-400/g, to: 'text-indigo-600' },
  { from: /text-indigo-300/g, to: 'text-indigo-700' },
  
  // Semantic Colors
  { from: /text-emerald-400/g, to: 'text-emerald-600' },
  { from: /text-emerald-500/g, to: 'text-emerald-600' },
  { from: /text-amber-400/g, to: 'text-amber-600' },
  { from: /text-amber-500/g, to: 'text-amber-600' },
  { from: /text-red-400/g, to: 'text-red-600' },
  { from: /text-red-500/g, to: 'text-red-600' },
  
  { from: /bg-emerald-500\/10/g, to: 'bg-emerald-50' },
  { from: /bg-emerald-500\/20/g, to: 'bg-emerald-100' },
  { from: /bg-amber-500\/10/g, to: 'bg-amber-50' },
  { from: /bg-red-500\/10/g, to: 'bg-red-50' },

  { from: /border-emerald-500\/30/g, to: 'border-emerald-200' },
  { from: /border-amber-500\/30/g, to: 'border-amber-200' },
  { from: /border-red-500\/30/g, to: 'border-red-200' },
  
  // Recharts text fills
  { from: /fill="#94a3b8"/g, to: 'fill="#64748b"' },
  { from: /fill="#fff"/g, to: 'fill="#0f172a"' },

  // Shadows
  { from: /shadow-2xl/g, to: 'shadow-md hover:shadow-lg transition-shadow' },
];

const files = walkSync(path.join(__dirname, 'client/src'));

let changedFiles = 0;
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  for (const rule of replacements) {
    content = content.replace(rule.from, rule.to);
  }
  
  if (file.endsWith('index.css')) {
     content = content.replace(/background-color: var\(--color-zinc-950\);/g, 'background-color: var(--color-slate-50);');
     content = content.replace(/color: var\(--color-zinc-50\);/g, 'color: var(--color-slate-900);');
  }

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    changedFiles++;
    console.log(`Updated ${file}`);
  }
}

console.log(`Total files updated: ${changedFiles}`);
