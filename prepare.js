const fs = require("fs");

const content = JSON.parse(fs.readFileSync("package.json").toString());
delete content.dependencies;
fs.writeFileSync(`dist/package.json`, JSON.stringify(content, null, 2));

fs.writeFileSync(
  "dist/README.md",
  fs.readFileSync("README.md").toString()
);
