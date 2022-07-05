const fs = require("fs");

const brokenFile = "node_modules/@clerk/clerk-sdk-node/package.json";
if (fs.existsSync(brokenFile)) {
  const content = fs.readFileSync(brokenFile).toString();
  fs.writeFileSync(
    brokenFile,
    content.replace(
      `"@clerk/backend-core": "^1.11.1",`,
      `"@clerk/backend-core": "^1.11.0",`
    )
  );
} else {
  console.log("no more file, remove script");
}
