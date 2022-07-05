const fs = require("fs");

const content = JSON.parse(fs.readFileSync("package.json").toString());
delete content.dependencies;
delete content.scripts.postinstall;
content.files = fs.readdirSync("dist/app/package").map((d) => {
  fs.renameSync(`dist/app/package/${d}`, `dist/${d}`);
  return `/${d}`;
});
fs.writeFileSync(
  "dist/scripts/postinstall.js",
  fs.readFileSync("scripts/postinstall.js").toString()
);
content.files.push("/scripts");

fs.writeFileSync(`dist/package.json`, JSON.stringify(content, null, 2));
fs.writeFileSync("dist/README.md", fs.readFileSync("README.md").toString());
fs.mkdirSync("dist/scripts");
