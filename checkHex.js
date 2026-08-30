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
  const content = fs.readFileSync(file, 'utf8');
  const matches = content.match(/#[0-9a-fA-F]{3,6}/g);
  if (matches) {
    console.log(`File: ${file} =>`, [...new Set(matches)]);
  }
}
