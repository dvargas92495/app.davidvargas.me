import { z } from "zod";

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

const report = z.object({
  uuid: z.string().uuid().describe("primary"),
  userId: z.string().max(191),
  start: z.date(),
  end: z.date(),
});

const reportEvent = z.object({
  uuid: z.string().uuid().describe("primary"),
  eventUuid: z.string().uuid().describe("foreign"),
  reportUuid: z.string().uuid().describe("foreign"),
});

const reportSource = z.object({
  uuid: z.string().uuid().describe("primary"),
  source: z.string().max(191).describe("unique"),
  snapshot: z.number(),
  reportUuid: z.string().uuid().describe("foreign unique"),
});

const schema = {
  rule,
  event,
  report,
  reportEvent,
  reportSource,
  ruleCondition,
};

export default schema;
