const fs = require("fs");

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
