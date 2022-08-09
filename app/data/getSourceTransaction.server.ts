import Web3 from "web3";
import dateFnsFormat from "date-fns/format";
import { z } from "zod";
import { NotFoundResponse } from "~/package/backend/responses.server";
import axios from "axios";
import { taxCodeByLabel } from "~/enums/taxCodes";
import { Rule, TRANSFORM_AMOUNT_OPERATION } from "~/enums/rules";
import getMysqlConnection from "~/package/backend/mysql.server";

const dataSchema = z.object({
  source: z.string(),
  id: z.string(),
});

const getSourceTransaction = async ({
  userId,
  params,
}: {
  userId: string;
  params: Record<string, string | undefined>;
}) => {
  const { source, id } = dataSchema.parse(params);
  switch (source) {
    case "ethereum": {
      const web3 = new Web3(
        `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
      );
      return web3.eth.getTransaction(id).then((tx) =>
        Promise.all([
          web3.eth.getTransactionReceipt(id),
          web3.eth.getBlock(tx.blockNumber || 0),
          import("@clerk/clerk-sdk-node")
            .then((clerk) => clerk.users.getUser(userId))
            .then(async (user) => {
              const account = user.publicMetadata.ethereum as {
                address: string;
              };
              return account.address;
            }),
        ]).then(([_, block, __]) => {
          // const from = tx.from.toLowerCase();
          // const to = (tx.to || "").toLowerCase();
          // receipt.events - this will have log events that would be juicy
          return {
            id,
            date: dateFnsFormat(
              new Date(Number(block.timestamp) * 1000),
              "yyyy-MM-dd hh:mm a"
            ),
            // from: tx.from === address ? "ME" : addressBook[from] || from,
            // to: tx.to === address ? "ME" : addressBook[to] || to,
            // gas: `${
            //   (Number(receipt.gasUsed) * Number(tx.gasPrice)) / Math.pow(10, 18)
            // } ETH`,
            // value: `${(Number(tx.value) / Math.pow(10, 18)).toFixed(6)} ETH`,
            // TODO: FILL
            description: "",
            amount: 0,
            code: 0,
            log: [],
            url: "",
            found: false,
          };
        })
      );
    }
    case "mercury": {
      const user = await import("@clerk/clerk-sdk-node").then((clerk) =>
        clerk.users.getUser(userId)
      );
      const account = user.publicMetadata.Mercury as {
        username: string;
        apiToken: string;
      };
      const apikey = account.apiToken;
      const opts = {
        headers: { Authorization: `Bearer ${apikey}` },
      };
      const accountId = await axios
        .get("https://backend.mercury.com/api/v1/accounts", opts)
        .then((r) => r.data.accounts[0]?.id)
        .catch(() => {
          throw new Error("Failed to find account");
        });
      const tx = await axios
        .get<{
          id: string;
          amount: number;
          createdAt: string;
          status: "sent";
          note: string | null; // TODO add to list description
          bankDescription: string;
          externalMemo: string;
          counterpartyName: string;
          counterpartyNickname: string | null;
        }>(
          `https://backend.mercury.com/api/v1/account/${accountId}/transaction/${id}`,
          opts
        )
        .then((tx) => tx.data)
        .catch(() => {
          throw new Error("Failed to find transaction");
        });
      const rules = await getMysqlConnection()
        .then((cxn) =>
          cxn.execute(
            `SELECT c.*, r.transform_amount_operation, r.transform_amount_operand, r.transform_code, r.transform_description 
            FROM rules r INNER JOIN rule_conditions c ON c.rule_uuid = r.uuid`
          )
        )
        .then(([res]) => {
          const rows = res as {
            transform_amount_operation: number;
            transform_amount_operand: number;
            transform_code: number;
            transform_description: string;
            rule_uuid: string;
            position: number;
            uuid: string;
            condition_key: string;
            value: string;
            operation: string;
          }[];
          const rules = rows.reduce(
            (p, c) => {
              if (p[c.rule_uuid]) {
                p[c.rule_uuid].conditions.push({
                  key: c.condition_key,
                  operation: c.operation,
                  value: c.value,
                  position: c.position,
                });
              } else {
                p[c.rule_uuid] = {
                  transform: {
                    description: c.transform_description,
                    code: c.transform_code,
                    amount: {
                      operation:
                        TRANSFORM_AMOUNT_OPERATION[
                          c.transform_amount_operation
                        ],
                      operand: c.transform_amount_operand,
                    },
                  },
                  conditions: [
                    {
                      key: c.condition_key,
                      value: c.value,
                      operation: c.operation,
                      position: c.position,
                    },
                  ],
                };
              }
              return p;
            },
            {} as Record<
              string,
              {
                conditions: {
                  key: string;
                  operation: string;
                  value: string;
                  position: number;
                }[];
                transform: {
                  description: string;
                  code: number;
                  amount: {
                    operation: string;
                    operand: number;
                  };
                };
              }
            >
          );
          return Object.entries(rules).map(([uuid, obj]) => ({
            ...obj,
            uuid,
            conditions: obj.conditions.sort((a, b) => a.position - b.position),
          }));
        });
      const rule = rules.find((r) =>
        r.conditions.every(({ key, operation, value }) => {
          if (!(key in tx)) return false;
          const actual = tx[key as keyof typeof tx];
          if (actual === null) return false;
          if (operation === "equals") {
            return actual === value;
          } else if (operation === "contains") {
            return `${actual}`.includes(value);
          } else if (operation === "startsWith") {
            return `${actual}`.startsWith(value);
          } else if (operation === "lessThan") {
            const asDate = new Date(value).valueOf();
            return asDate
              ? new Date(actual).valueOf() < asDate
              : Number(actual) < Number(asDate);
          } else {
            return false;
          }
        })
      );
      const code = rule?.transform?.code || 0;
      const description = rule?.transform?.description || "";
      const amount =
        rule?.transform?.amount?.operation === "multiply"
          ? Math.round(tx.amount * Number(rule.transform.amount.operand))
          : 0;
      return {
        id,
        date: dateFnsFormat(new Date(tx.createdAt), "yyyy-MM-dd hh:mm a"),
        description,
        amount,
        code,
        log: [],
        url: `https://mercury.com/transactions/${id}`,
        found: !!rule,
      };
    }
    case "stripe": {
      return {
        id,
        date: dateFnsFormat(new Date(0), "yyyy-MM-dd hh:mm a"),
        description: "",
        amount: 0,
        code: 0,
        log: [],
        url: "",
        found: false,
      };
    }
    case "splitwise": {
      return {
        id,
        date: dateFnsFormat(new Date(0), "yyyy-MM-dd hh:mm a"),
        description: "",
        amount: 0,
        code: 0,
        log: [],
        url: "",
        found: false,
      };
    }
    case "chase": {
      return {
        id,
        date: dateFnsFormat(new Date(0), "yyyy-MM-dd hh:mm a"),
        description: "",
        amount: 0,
        code: 0,
        log: [],
        url: "",
        found: false,
      };
    }
    case "venmo": {
      return {
        id,
        date: dateFnsFormat(new Date(0), "yyyy-MM-dd hh:mm a"),
        description: "",
        amount: 0,
        code: 0,
        log: [],
        url: "",
        found: false,
      };
    }
    case "citibank": {
      return {
        id,
        date: dateFnsFormat(new Date(0), "yyyy-MM-dd hh:mm a"),
        description: "",
        amount: 0,
        code: 0,
        log: [],
        url: "",
        found: false,
      };
    }
    default:
      throw new NotFoundResponse(`Unknown source ${source}`);
  }
};

export default getSourceTransaction;
