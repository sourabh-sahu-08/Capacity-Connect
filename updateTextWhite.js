const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

walk('client/src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Split into lines to modify only matching lines
    let lines = content.split('\n');
    let modified = false;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('bg-purple-600') && !lines[i].includes('text-white')) {
        // Find className="... bg-purple-600 ..." and add text-white
        if (lines[i].includes('className="') || lines[i].includes('className={`')) {
            lines[i] = lines[i].replace(/bg-purple-600/, 'bg-purple-600 text-white');
            modified = true;
        }
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
      console.log(`Added text-white to ${filePath}`);
    }
  }
});
