export const RULE_CONDITION_OPERATIONS = [
  "equals",
  "contains",
  "startsWith",
  "lessThan",
] as const;
type RuleConditionOperation = typeof RULE_CONDITION_OPERATIONS[number];
export const TRANSFORM_AMOUNT_OPERATION = ["multiply"];
type TransformAmountOperation = typeof TRANSFORM_AMOUNT_OPERATION[number];
export type Rule = {
  conditions: {
    key: string;
    value: string;
    operation: RuleConditionOperation;
  }[];
  transform: {
    amount?: { operation: TransformAmountOperation; operand: string };
    code?: number;
    description?: string;
  };
};
