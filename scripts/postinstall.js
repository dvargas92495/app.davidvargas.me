const fs = require("fs");

const brokenDir = "node_modules/@clerk/clerk-sdk-node/node_modules";
if (fs.existsSync(brokenDir)) {
  fs.rmSync(brokenDir, { recursive: true, force: true });
  console.log("removed broken dir");
} else {
  console.log("no more broken dir, remove script");
}

const brokenFile = "node_modules/@clerk/clerk-sdk-node/esm/utils/crypto.js";
if (fs.existsSync(brokenFile)) {
  fs.renameSync(
    brokenFile,
    "node_modules/@clerk/clerk-sdk-node/esm/utils/Crypto.js"
  );
  console.log("copied broken file");
} else {
  console.log("no more broken file, remove script");
}
