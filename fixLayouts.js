const fs = require('fs');

function fixImports(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/\.\.\/\.\.\/store\/authStore/g, '../store/authStore');
  content = content.replace(/\(state\) =>/g, '(state: any) =>');
  fs.writeFileSync(file, content, 'utf8');
}

fixImports('client/src/layouts/ManagerSidebar.tsx');
fixImports('client/src/layouts/TrainerSidebar.tsx');
