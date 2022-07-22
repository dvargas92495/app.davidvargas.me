import getMysqlConnection from "~/package/backend/mysql.server";
import type { MigrationProps } from "fuegojs/dist/migrate";
import { taxCodeByLabel } from "~/enums/taxCodes";
import { v4 } from "uuid";
import { users } from "@clerk/clerk-sdk-node";
import {
  Rule,
  RULE_CONDITION_OPERATIONS,
  TRANSFORM_AMOUNT_OPERATION,
} from "~/enums/rules";

const rules: Rule[] = [
  {
    conditions: [
      { key: "counterpartyName", value: "UNIT", operation: "equals" },
    ],
    transform: {
      amount: { operation: "multiply", operand: "100" },
      code: taxCodeByLabel["Owner's Draw"],
      description: "Setting Aside for Taxes and IRA",
    },
  },
  {
    conditions: [
      {
        key: "counterpartyName",
        value: "CATCH FINANCIAL",
        operation: "startsWith",
      },
    ],
    transform: {
      amount: { operation: "multiply", operand: "100" },
      code: taxCodeByLabel["Owner's Draw"],
      description: "Setting Aside for Taxes and IRA",
    },
  },
  {
    conditions: [
      {
        key: "counterpartyName",
        value: "Bond Financial T",
        operation: "equals",
      },
    ],
    transform: {
      amount: { operation: "multiply", operand: "100" },
      code: taxCodeByLabel["Owner's Draw"],
      description: "Setting Aside for Taxes and IRA",
    },
  },
  {
    conditions: [
      { key: "counterpartyName", value: "DAVID VARGAS", operation: "equals" },
      { key: "createdAt", value: "2022-02-28", operation: "lessThan" },
    ],
    transform: {
      amount: { operation: "multiply", operand: "100" },
      code: taxCodeByLabel["Owner's Draw"],
      description: "Setting Aside for Taxes and IRA",
    },
  },
  {
    conditions: [
      {
        key: "counterpartyName",
        value: "OscarInsuranceCo",
        operation: "equals",
      },
    ],
    transform: {
      amount: { operation: "multiply", operand: "100" },
      code: taxCodeByLabel["Insurance"],
      description: "Health Insurance",
    },
  },
  {
    conditions: [
      {
        key: "counterpartyName",
        value: "GUARDIAN DENTAL",
        operation: "equals",
      },
    ],
    transform: {
      amount: { operation: "multiply", operand: "100" },
      code: taxCodeByLabel["Insurance"],
      description: "Dental Insurance",
    },
  },
  {
    conditions: [
      {
        key: "counterpartyName",
        value: "Jonathan Hillis",
        operation: "equals",
      },
    ],
    transform: {
      amount: { operation: "multiply", operand: "100" },
      code: taxCodeByLabel["Wages & Salaries"],
      description: "Mentorship on an Income Sharing Agreement",
    },
  },
  {
    conditions: [
      {
        key: "counterpartyName",
        value: "STRIPE",
        operation: "equals",
      },
    ],
    transform: {
      amount: { operation: "multiply", operand: "100" },
      code: taxCodeByLabel["Owner's Capital"],
      description: "Payout from Stripe",
    },
  },
  {
    conditions: [
      {
        key: "counterpartyName",
        value: "Citi - Checking",
        operation: "startsWith",
      },
    ],
    transform: {
      amount: { operation: "multiply", operand: "100" },
      code: taxCodeByLabel["Owner's Capital"],
      description: "Transfer with personal checking account",
    },
  },
  {
    conditions: [
      {
        key: "counterpartyName",
        value: "FISSION Internet",
        operation: "equals",
      },
    ],
    transform: {
      amount: { operation: "multiply", operand: "100" },
      code: taxCodeByLabel["Service"],
      description: "Fission Freelancing",
    },
  },
  {
    conditions: [
      {
        key: "counterpartyName",
        value: "CONVERTKIT EMAIL",
        operation: "equals",
      },
    ],
    transform: {
      amount: { operation: "multiply", operand: "100" },
      code: taxCodeByLabel["Dues & Subscriptions"],
      description: "Email Marketing Software",
    },
  },
  {
    conditions: [
      {
        key: "counterpartyName",
        value: "GitHub Sponsors",
        operation: "equals",
      },
    ],
    transform: {
      amount: { operation: "multiply", operand: "100" },
      code: taxCodeByLabel["Service"],
      description: "RoamJS Sponsors",
    },
  },
  {
    conditions: [
      {
        key: "counterpartyName",
        value: "Amazon Web Services",
        operation: "equals",
      },
    ],
    transform: {
      amount: { operation: "multiply", operand: "100" },
      code: taxCodeByLabel["Dues & Subscriptions"],
      description: "App Hosting",
    },
  },
  {
    conditions: [
      {
        key: "counterpartyName",
        value: "GITHUB",
        operation: "equals",
      },
    ],
    transform: {
      amount: { operation: "multiply", operand: "100" },
      code: taxCodeByLabel["Dues & Subscriptions"],
      description: "Sponsoring Software",
    },
  },
  {
    conditions: [
      {
        key: "counterpartyName",
        value: "HMF",
        operation: "equals",
      },
    ],
    transform: {
      amount: { operation: "multiply", operand: "100" },
      code: taxCodeByLabel["Automobile Expense"],
      description: "Car for Commuting",
    },
  },
  {
    conditions: [
      {
        key: "counterpartyName",
        value: "ROBINHOOD",
        operation: "equals",
      },
    ],
    transform: {
      amount: { operation: "multiply", operand: "100" },
      code: taxCodeByLabel["Owner's Investment"],
      description: "Personal Investments",
    },
  },
  {
    conditions: [
      {
        key: "counterpartyName",
        value: "FUNDRISE",
        operation: "startsWith",
      },
    ],
    transform: {
      amount: { operation: "multiply", operand: "100" },
      code: taxCodeByLabel["Owner's Investment"],
      description: "Personal Investments",
    },
  },
  {
    conditions: [
      {
        key: "counterpartyName",
        value: "Roam Research",
        operation: "startsWith",
      },
    ],
    transform: {
      amount: { operation: "multiply", operand: "100" },
      code: taxCodeByLabel["Service"],
      description: "RoamJS Freelancing",
    },
  },
  {
    conditions: [
      {
        key: "counterpartyName",
        value: "GEICO",
        operation: "equals",
      },
    ],
    transform: {
      amount: { operation: "multiply", operand: "100" },
      code: taxCodeByLabel["Automobile Expense"],
      description: "Insurance for Car for Commuting",
    },
  },
  {
    conditions: [
      {
        key: "counterpartyName",
        value: "Vargas Arts, LLC",
        operation: "equals",
      },
    ],
    transform: {
      amount: { operation: "multiply", operand: "100" },
      code: taxCodeByLabel["Service"],
      description: "RoamJS SmartBlocks",
    },
  },
  {
    conditions: [
      {
        key: "counterpartyName",
        value: "CHASE CREDIT CRD",
        operation: "equals",
      },
    ],
    transform: {
      amount: { operation: "multiply", operand: "100" },
      code: taxCodeByLabel["Owner's Capital"],
      description: "Personal Paycheck",
    },
  },
  {
    conditions: [
      {
        key: "counterpartyName",
        value: "VENMO",
        operation: "equals",
      },
    ],
    transform: {
      amount: { operation: "multiply", operand: "100" },
      code: taxCodeByLabel["Owner's Capital"],
      description: "Personal Paycheck",
    },
  },
  {
    conditions: [
      {
        key: "counterpartyName",
        value: "Xero Inc",
        operation: "equals",
      },
    ],
    transform: {
      amount: { operation: "multiply", operand: "100" },
      code: taxCodeByLabel["Dues & Subscriptions"],
      description: "Accounting Software",
    },
  },
  {
    conditions: [
      {
        key: "counterpartyName",
        value: "ALEXANDRU GLV",
        operation: "equals",
      },
    ],
    transform: {
      amount: { operation: "multiply", operand: "100" },
      code: taxCodeByLabel["Subcontractors"],
      description: "Design Contractor",
    },
  },
  {
    conditions: [
      {
        key: "counterpartyName",
        value: "Calendly",
        operation: "equals",
      },
    ],
    transform: {
      amount: { operation: "multiply", operand: "100" },
      code: taxCodeByLabel["Dues & Subscriptions"],
      description: "Scheduling Software",
    },
  },
  {
    conditions: [
      {
        key: "counterpartyName",
        value: "United States Postal Service",
        operation: "equals",
      },
    ],
    transform: {
      amount: { operation: "multiply", operand: "100" },
      code: taxCodeByLabel["Dues & Subscriptions"],
      description: "Mailing Taxes",
    },
  },
  {
    conditions: [
      {
        key: "counterpartyName",
        value: "LogMeIn",
        operation: "equals",
      },
    ],
    transform: {
      amount: { operation: "multiply", operand: "100" },
      code: taxCodeByLabel["Dues & Subscriptions"],
      description: "Password Management Software",
    },
  },
  {
    conditions: [
      {
        key: "counterpartyName",
        value: "LOOM SUBSCRIPTION",
        operation: "equals",
      },
    ],
    transform: {
      amount: { operation: "multiply", operand: "100" },
      code: taxCodeByLabel["Dues & Subscriptions"],
      description: "Video Recording Software",
    },
  },
  {
    conditions: [
      {
        key: "counterpartyName",
        value: "Givebutter",
        operation: "equals",
      },
    ],
    transform: {
      amount: { operation: "multiply", operand: "100" },
      code: taxCodeByLabel["Service"],
      description: "RoamJS Sponsors",
    },
  },
  {
    conditions: [
      {
        key: "counterpartyName",
        value: "AME*GOGOAIRCR",
        operation: "equals",
      },
    ],
    transform: {
      amount: { operation: "multiply", operand: "100" },
      code: taxCodeByLabel["Dues & Subscriptions"],
      description: "Wifi for Work",
    },
  },
];

export const migrate = ({ connection }: MigrationProps) => {
  return getMysqlConnection(connection).then((connection) =>
    connection
      .execute(
        `CREATE TABLE IF NOT EXISTS rules (
          uuid                         VARCHAR(36)  NOT NULL,
          user_id                      VARCHAR(191) NOT NULL,
          label                        VARCHAR(128) NOT NULL,
          transform_amount_operation   TINYINT(4)   NOT NULL,
          transform_amount_operand     VARCHAR(255) NOT NULL,
          transform_code               INT          NOT NULL,
          transform_description        VARCHAR(256) NOT NULL,
  
          PRIMARY KEY (uuid),
          CONSTRAINT UC_source UNIQUE (user_id,label)
        )`
      )
      .then(() =>
        connection.execute(`CREATE TABLE IF NOT EXISTS rule_conditions (
        uuid                         VARCHAR(36)  NOT NULL,
        rule_uuid                    VARCHAR(36)  NOT NULL,
        position                     TINYINT(4)   NOT NULL,
        condition_key                VARCHAR(128) NOT NULL,
        value                        VARCHAR(128) NOT NULL,
        operation                    TINYINT(4)   NOT NULL,
        
        PRIMARY KEY (uuid),
        CONSTRAINT UC_rule_id_position UNIQUE (rule_uuid,position),
        FOREIGN KEY (rule_uuid) REFERENCES \`rules\`(\`uuid\`)
      )`)
      )
      .then(async () => {
        const userId = await users
          .getUserList({ emailAddress: ["dvargas92495@gmail.com"] })
          .then((u) => u[0].id)
          .catch(() => "user_foo");
        const ruleRecords = rules.map((r) => ({
          ...r.transform,
          uuid: v4(),
          conditions: r.conditions.map((rc) => ({
            ...rc,
            uuid: v4(),
          })),
        }));
        await connection.execute(
          `INSERT INTO rules (uuid, user_id, label, transform_amount_operation, transform_amount_operand, transform_code, transform_description)
          VALUES ${ruleRecords.map(() => `(?,?,?,?,?,?,?)`).join(",")}`,
          ruleRecords.flatMap((r) => [
            r.uuid,
            userId,
            r.conditions[0].value,
            TRANSFORM_AMOUNT_OPERATION.indexOf(
              r.amount?.operation || "multiply"
            ),
            r.amount?.operand || "100",
            r.code || 0,
            r.description || "Misisng description",
          ])
        );
        return connection.execute(
          `INSERT INTO rule_conditions (uuid, rule_uuid, condition_key, operation, value, position)
          VALUES ${ruleRecords
            .flatMap((r) => r.conditions.map(() => `(?,?,?,?,?,?)`))
            .join(",")}`,
          ruleRecords.flatMap((r) =>
            r.conditions.flatMap((rc, position) => [
              rc.uuid,
              r.uuid,
              rc.key,
              RULE_CONDITION_OPERATIONS.indexOf(rc.operation),
              rc.value,
              position + 1,
            ])
          )
        );
      })
  );
};

export const revert = ({ connection }: MigrationProps) => {
  return getMysqlConnection(connection).then((connection) =>
    connection
      .execute(`DROP TABLE rule_conditions`)
      .then(() => connection.execute(`DROP TABLE rules`))
  );
};
