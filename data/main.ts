import { TerraformVariable } from "cdktf";
import { ActionsSecret } from "@cdktf/provider-github";
import base from "fuegojs/dist/base";
import { z } from "zod";

const projectName = "app.davidvargas.me";

const events = z.object({
  uuid: z.string().uuid().describe("primary"),
  source: z.string().max(191).describe("unique"),
  sourceId: z.string().max(191).describe("unique"),
  date: z.date(),
  amount: z.number(),
  description: z.string().max(191),
  code: z.number(),
});

const rules = z.object({
  uuid: z.string().uuid().describe("primary"),
  userId: z.string().max(191),
  label: z.string(),
  transformAmountOperation: z.number().max(Math.pow(2, 4)),
  transformAmountOperand: z.number().max(255),
  transformCode: z.number(),
  transformDescription: z.string().max(256),
});

const ruleConditions = z.object({
  uuid: z.string().uuid().describe("primary"),
  ruleUuid: z.string().uuid().describe("foreign unique"),
  position: z.number().max(Math.pow(2, 4)).describe("unique"),
  conditionKey: z.string(),
  value: z.string(),
  operation: z.number().max(Math.pow(2, 4)),
}).refine;

const schema = { rules, events, ruleConditions };

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
