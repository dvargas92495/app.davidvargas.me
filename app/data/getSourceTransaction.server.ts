import Web3 from "web3";
import dateFnsFormat from "date-fns/format";
import { z } from "zod";
import { NotFoundResponse } from "~/package/backend/responses.server";
import axios from "axios";
import { taxCodeByLabel } from "~/enums/taxCodes";

const rules: {
  conditions: {
    key: string;
    value: string;
    operation: "equals" | "contains" | "startsWith";
  }[];
  transform: {
    amount?: { operation: "mutliply"; operand: string };
    code?: number;
    description?: string;
  };
}[] = [
  {
    conditions: [
      { key: "counterpartyName", value: "UNIT", operation: "equals" },
    ],
    transform: {
      amount: { operation: "mutliply", operand: "100" },
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
      amount: { operation: "mutliply", operand: "100" },
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
      amount: { operation: "mutliply", operand: "100" },
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
      amount: { operation: "mutliply", operand: "100" },
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
      amount: { operation: "mutliply", operand: "100" },
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
      amount: { operation: "mutliply", operand: "100" },
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
      amount: { operation: "mutliply", operand: "100" },
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
      amount: { operation: "mutliply", operand: "100" },
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
      amount: { operation: "mutliply", operand: "100" },
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
      amount: { operation: "mutliply", operand: "100" },
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
      amount: { operation: "mutliply", operand: "100" },
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
      amount: { operation: "mutliply", operand: "100" },
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
      amount: { operation: "mutliply", operand: "100" },
      code: taxCodeByLabel["Owner's Investment"],
      description: "Personal Investments",
    },
  },
  {
    conditions: [
      {
        key: "counterpartyName",
        value: "FUNDRISE REAL ES",
        operation: "equals",
      },
    ],
    transform: {
      amount: { operation: "mutliply", operand: "100" },
      code: taxCodeByLabel["Owner's Investment"],
      description: "Personal Investments",
    },
  },
];

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
          } else {
            return false;
          }
        })
      );
      const code = rule?.transform?.code || 0;
      const description = rule?.transform?.description || "";
      const amount =
        rule?.transform?.amount?.operation === "mutliply"
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
