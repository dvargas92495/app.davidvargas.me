import { TerraformVariable } from "cdktf";
import { ActionsSecret } from "@cdktf/provider-github";
import base from "fuegojs/dist/base";
import { z } from "zod";

const projectName = "app.davidvargas.me";

const event = z.object({
  uuid: z.string().uuid().describe("primary"),
  source: z.string().max(191).describe("unique"),
  sourceId: z.string().max(191).describe("unique"),
  date: z.date(),
  amount: z.number(),
  description: z.string().max(191),
  code: z.number(),
});

const rule = z.object({
  uuid: z.string().uuid().describe("primary"),
  userId: z.string().max(191),
  label: z.string(),
  transformAmountOperation: z.number().max(Math.pow(2, 4)),
  transformAmountOperand: z.number().max(255),
  transformCode: z.number(),
  transformDescription: z.string().max(256),
});

const ruleCondition = z.object({
  uuid: z.string().uuid().describe("primary"),
  ruleUuid: z.string().uuid().describe("foreign unique"),
  position: z.number().max(Math.pow(2, 4)).describe("unique"),
  conditionKey: z.string(),
  value: z.string(),
  operation: z.number().max(Math.pow(2, 4)),
});

const schema = { rule, event, ruleCondition };

base({
  projectName,
  safeProjectName: "app",
  clerkDnsId: "iecxnb2omjxr",
  schema,
  variables: [
    "notion_api_key","npm_token","infura_project_id",
  ],
  callback() {

    const convertkit_api_key = new TerraformVariable(
      this,
      "convertkit_api_key",
      {
        type: "string",
      }
    );

    new ActionsSecret(this, "convertkit_api_key_secret", {
      repository: projectName,
      secretName: "CONVERTKIT_API_KEY",
      plaintextValue: convertkit_api_key.value,
    });
  },
});
