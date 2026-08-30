const fs = require('fs');
const path = require('path');
const walkSync = (dir, filelist = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) { filelist = walkSync(dirFile, filelist); }
    else if (dirFile.endsWith('.tsx')) { filelist.push(dirFile); }
  }
  return filelist;
};

const files = walkSync(path.join(__dirname, 'client/src'));
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  // We need to find elements with bg-indigo-600 and change text-slate-900 to text-white.
  // Actually, let's just do a regex replace on lines containing bg-indigo-600
  let lines = content.split('\n');
  let changed = false;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('bg-indigo-600') && lines[i].includes('text-slate-900')) {
      lines[i] = lines[i].replace('text-slate-900', 'text-white');
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(file, lines.join('\n'), 'utf8');
    console.log(`Fixed primary button text in ${file}`);
  }
}
