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
  content = content.replace(/bg-white\/50/g, 'bg-white shadow-sm');
  content = content.replace(/bg-white\/40/g, 'bg-white shadow-sm');
  content = content.replace(/backdrop-blur-sm/g, '');
  content = content.replace(/backdrop-blur-xl/g, '');
  content = content.replace(/backdrop-blur-md/g, '');
  fs.writeFileSync(file, content, 'utf8');
}
