const fs = require('fs');
let content = fs.readFileSync('client/src/App.tsx', 'utf8');

content = content.replace(
  /} \r\n\r\n          <Route \r\n            path="\/dashboard"/,
  "} \r\n          />\r\n          <Route \r\n            path=\"/dashboard\""
);

content = content.replace(
  /} \n\n          <Route \n            path="\/dashboard"/,
  "} \n          />\n          <Route \n            path=\"/dashboard\""
);


fs.writeFileSync('client/src/App.tsx', content, 'utf8');
