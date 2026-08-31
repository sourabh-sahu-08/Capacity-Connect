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
    
    // Add neon glow to primary purple buttons
    // Look for bg-purple-600 that are buttons or have text-white
    if (content.includes('bg-purple-600') && !content.includes('shadow-[0_0_15px_rgba(147,51,234,0.4)]')) {
      content = content.replace(/bg-purple-600(?!\/)/g, 'bg-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.5)]');
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Added neon glow to ${filePath}`);
    }
  }
});
