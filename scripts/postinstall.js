const fs = require("fs");

const brokenDir = "node_modules/@clerk/clerk-sdk-node/node_modules";
if (fs.existsSync(brokenDir)) {
  fs.rmSync(brokenDir, { recursive: true, force: true });
} else {
  console.log("no more dir, remove script");
}
