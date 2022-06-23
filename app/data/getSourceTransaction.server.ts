import Web3 from "web3";
import dateFnsFormat from "date-fns/format";
import { z } from "zod";
import { NotFoundResponse } from "~/package/backend/responses.server";
import axios from "axios";

const rules = [];

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
        ]).then(([receipt, block, address]) => {
          const from = tx.from.toLowerCase();
          const to = (tx.to || "").toLowerCase();
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
          data: {
            id: string;
            amount: number;
            createdAt: string;
            status: "sent";
            note: string | null; // TODO add to list description
            bankDescription: string;
            externalMemo: string;
            counterpartyName: string;
            counterpartyNickname: string | null;
          };
        }>(
          `https://backend.mercury.com/api/v1/account/${accountId}/transaction/${id}`,
          opts
        )
        .catch(() => {
          throw new Error("Failed to find transaction");
        });
      return {
        id,
        date: dateFnsFormat(new Date(0), "yyyy-MM-dd hh:mm a"),
        description: "",
        amount: 0,
        code: 0,
        log: [],
        url: `https://mercury.com/transactions/${id}`,
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
      };
    }
    default:
      throw new NotFoundResponse(`Unknown source ${source}`);
  }
};

export default getSourceTransaction;
