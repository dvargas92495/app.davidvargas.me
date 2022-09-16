import { z } from "zod";

const uuid = z.string().uuid().describe("primary");
const userId = z.string().max(191);

const source = z.object({
  uuid,
  userId,
  label: z.string().max(128),
  snapshotUrl: z.string().max(512),
  feedUrl: z.string().max(512),
  credentials: z.string(),
});

const event = z.object({
  uuid,
  source: z.string().max(191).describe("unique"),
  sourceId: z.string().max(191).describe("unique"),
  date: z.date(),
  amount: z.number(),
  description: z.string().max(191),
  code: z.number(),
});

const rule = z.object({
  uuid,
  userId,
  label: z.string(),
  transformAmountOperation: z.number().max(Math.pow(2, 4)),
  transformAmountOperand: z.number().max(255),
  transformCode: z.number(),
  transformDescription: z.string().max(256),
});

const ruleCondition = z.object({
  uuid,
  ruleUuid: z.string().uuid().describe("foreign unique"),
  position: z.number().max(Math.pow(2, 4)).describe("unique"),
  conditionKey: z.string(),
  value: z.string(),
  operation: z.number().max(Math.pow(2, 4)),
});

const report = z.object({
  uuid,
  userId,
  start: z.date(),
  end: z.date(),
});

const reportEvent = z.object({
  uuid,
  eventUuid: z.string().uuid().describe("foreign"),
  reportUuid: z.string().uuid().describe("foreign"),
});

const reportSource = z.object({
  uuid,
  source: z.string().max(191).describe("unique"),
  snapshot: z.number(),
  reportUuid: z.string().uuid().describe("foreign unique"),
});

const schema = {
  source,
  rule,
  event,
  report,
  reportEvent,
  reportSource,
  ruleCondition,
};

export default schema;
