const fs = require('fs');
let content = fs.readFileSync('client/src/App.tsx', 'utf8');

// Replace the messed up block
content = content.replace(
`          /> : <Navigate to="/login" />\r\n            } \r\n          />`, 
  ""
);
content = content.replace(
`          /> : <Navigate to="/login" />\n            } \n          />`, 
  ""
);


fs.writeFileSync('client/src/App.tsx', content, 'utf8');
