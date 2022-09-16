import base from "fuegojs/utils/base";
import schema from "./schema";

const projectName = "app.davidvargas.me";

base({
  projectName,
  safeProjectName: "app",
  clerkDnsId: "iecxnb2omjxr",
  schema,
  variables: [
    "notion_api_key",
    "npm_token",
    "infura_project_id",
    "convertkit_api_key",
    "encryption_key"
  ],
});
