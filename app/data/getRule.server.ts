import getMysqlConnection from "~/package/backend/mysql.server";
import { NotFoundError } from "~/package/backend/errors.server";
import {
  RULE_CONDITION_OPERATIONS,
  TRANSFORM_AMOUNT_OPERATION,
} from "~/enums/rules";

const getRule = (uuid: string) =>
  getMysqlConnection()
    .then((con) =>
      Promise.all([
        con.execute(`SELECT * FROM rules WHERE uuid = ?`, [uuid]),
        con.execute(`SELECT * FROM rule_conditions WHERE rule_uuid = ?`, [
          uuid,
        ]),
      ]).then((res) => {
        con.destroy();
        return res;
      })
    )
    .then(([a, b]) => {
      const record = (
        a as {
          uuid: string;
          user_id: string;
          label: string;
          transform_amount_operation: number;
          transform_amount_operand: string;
          transform_code: number;
          transform_description: string;
        }[]
      )[0];
      if (!record)
        throw new NotFoundError(`Could not find rule record: ${uuid}`);
      const conditions = b as {
        uuid: string;
        rule_uuid: string;
        condition_key: string;
        value: string;
        operation: number;
        position: number;
      }[];
      return {
        label: record.label,
        transform: {
          amount: {
            operation:
              TRANSFORM_AMOUNT_OPERATION[record.transform_amount_operation],
            operand: record.transform_amount_operand,
          },
          code: record.transform_code,
          description: record.transform_description,
        },
        conditions: conditions
          .sort((a, b) => a.position - b.position)
          .map((c) => ({
            key: c.condition_key,
            value: c.value,
            operation: RULE_CONDITION_OPERATIONS[c.operation],
          })),
      };
    });

export default getRule;
