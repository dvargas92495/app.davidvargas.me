import { TerraformVariable } from "cdktf";
import { ActionsSecret } from "@cdktf/provider-github";
import base from "fuegojs/dist/base";
import { z } from "zod";

const projectName = "app.davidvargas.me";

const events = z.object({
  uuid: z.string(),
  source: z.string(),
  sourceId: z.string(),
  date: z.date(),
  amount: z.number(),
  description: z.string(),
  code: z.number(),
});

const rules = z.object({
  uuid: z.string(),
  userId: z.string(),
  label: z.string(),
  transformAmountOperation: z.number(),
  transformAmountOperand: z.number(),
  transformCode: z.number(),
  transformDescription: z.string(),
});

[events, rules].slice(0);

base({
  projectName,
  safeProjectName: "app",
  clerkDnsId: "iecxnb2omjxr",
  callback() {
    const notion_api_key = new TerraformVariable(this, "notion_api_key", {
      type: "string",
    });
    const npm_token = new TerraformVariable(this, "npm_token", {
      type: "string",
    });

    const infura_project_id = new TerraformVariable(this, "infura_project_id", {
      type: "string",
    });

    const convertkit_api_key = new TerraformVariable(
      this,
      "convertkit_api_key",
      {
        type: "string",
      }
    );

    new ActionsSecret(this, "notion_api_key_secret", {
      repository: projectName,
      secretName: "NOTION_API_KEY",
      plaintextValue: notion_api_key.value,
    });
    new ActionsSecret(this, "npm_token_secret", {
      repository: projectName,
      secretName: "NPM_TOKEN",
      plaintextValue: npm_token.value,
    });

    new ActionsSecret(this, "infura_project_id_secret", {
      repository: projectName,
      secretName: "INFURA_PROJECT_ID",
      plaintextValue: infura_project_id.value,
    });

    new ActionsSecret(this, "convertkit_api_key_secret", {
      repository: projectName,
      secretName: "CONVERTKIT_API_KEY",
      plaintextValue: convertkit_api_key.value,
    });
  },
});
