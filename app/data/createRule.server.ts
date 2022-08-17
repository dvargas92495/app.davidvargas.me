import getMysqlConnection from "~/package/backend/mysql.server";
import { z } from "zod";
import { v4 } from "uuid";
import { TRANSFORM_AMOUNT_OPERATION } from "~/enums/rules";
import { taxCodeSet } from "~/enums/taxCodes";

const schema = z.object({
  label: z
    .string()
    .array()
    .refine((s) => s.length === 1)
    .transform((s) => s[0]),
  transformAmountOperation: z
    .string()
    .array()
    .refine((s) => s.length === 1)
    .transform((s) => Number(s[0]))
    .refine((a) => a < TRANSFORM_AMOUNT_OPERATION.length && a >= 0),
  transformAmountOperand: z
    .string()
    .array()
    .refine((s) => s.length === 1)
    .transform((s) => s[0]),
  transformCode: z
    .string()
    .array()
    .refine((s) => s.length === 1)
    .transform((s) => Number(s[0]))
    .refine((a) => taxCodeSet.has(a)),
  transformDescription: z
    .string()
    .array()
    .refine((s) => s.length === 1)
    .transform((s) => s[0]),
  conditionKeys: z
    .string()
    .array()
    .refine((s) => s.length > 0),
  conditionOperations: z
    .string()
    .array()
    .refine((s) => s.length > 0)
    .transform((s) => s.map((o) => Number(o))),
  conditionValues: z
    .string()
    .array()
    .refine((s) => s.length > 0),
});

const createRule = ({
  userId,
  data,
}: {
  userId: string;
  data: Record<string, string[]>;
}) => {
  const rule = schema.parse(data);
  const ruleUuid = v4();
  return getMysqlConnection()
    .then((cxn) =>
      cxn
        .execute(
          `INSERT INTO rules (uuid, user_id, label, transform_amount_operation, transform_amount_operand, transform_code, transform_description) 
      VALUES (?,?,?,?,?,?,?)`,
          [
            ruleUuid,
            userId,
            rule.label,
            rule.transformAmountOperation,
            rule.transformAmountOperand,
            rule.transformCode,
            rule.transformDescription,
          ]
        )
        .then(() =>
          cxn.execute(
            `INSERT INTO rule_conditions (uuid, rule_uuid, condition_key, operation, value, position)
        VALUES ${rule.conditionKeys.map(() => `(UUID(),?,?,?,?,?)`).join(",")}`,
            rule.conditionKeys.flatMap((key, position) => [
              ruleUuid,
              key,
              rule.conditionOperations[position],
              rule.conditionValues[position],
              position + 1,
            ])
          )
        )
        .then(() => cxn.destroy())
    )
    .then(() => ({
      uuid: ruleUuid,
      success: true,
      message: `Successfully created rule ${rule.label}`,
    }));
};

export default createRule;
