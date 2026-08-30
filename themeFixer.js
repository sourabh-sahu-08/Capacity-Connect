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
      if (dirFile.endsWith('.tsx') || dirFile.endsWith('.ts')) {
        filelist.push(dirFile);
      }
    }
  }
  return filelist;
};

const files = walkSync(path.join(__dirname, 'client/src'));

let changedFiles = 0;
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  content = content.replace(/text-slate-9000/g, 'text-slate-500');
  content = content.replace(/text-slate-8000/g, 'text-slate-400'); // wait, zinc-200 -> slate-800. zinc-2000? no.
  content = content.replace(/text-slate-[0-9]{4}/g, 'text-slate-500');
  content = content.replace(/bg-black/g, 'bg-white');
  content = content.replace(/text-zinc-600/g, 'text-slate-500');
  content = content.replace(/stroke="white"/g, 'stroke="#e2e8f0"');
  content = content.replace(/bg-white\/10/g, 'bg-slate-200');
  content = content.replace(/bg-white\/20/g, 'bg-slate-300');
  content = content.replace(/border-white\/20/g, 'border-slate-300');
  content = content.replace(/from-white/g, 'from-slate-900');
  content = content.replace(/to-zinc-600/g, 'to-slate-500');
  content = content.replace(/text-white/g, 'text-slate-900');
  content = content.replace(/text-black/g, 'text-slate-900');
  content = content.replace(/hover:bg-zinc-200/g, 'hover:bg-slate-100');
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    changedFiles++;
    console.log(`Updated ${file}`);
  }
}
