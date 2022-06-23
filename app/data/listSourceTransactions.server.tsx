import axios from "axios";
import getMysqlConnection from "~/package/backend/mysql.server";

const listSourceTransactions = ({
  userId,
  // searchParams,
}: {
  userId: string;
  // searchParams: Record<string, string>;
}) =>
  import("@clerk/clerk-sdk-node")
    .then((clerk) => clerk.users.getUser(userId))
    .then(async (user) => {
      const account = user.publicMetadata.Mercury as {
        username: string;
        apiToken: string;
      };
      if (!account) {
        throw new Response(`User has not yet connected their Mercury account`, {
          status: 403,
        });
      }
      const recordedTxs = await getMysqlConnection().then((con) =>
        Promise.all([
          con.execute(
            `SELECT source_id FROM revenue WHERE source = "mercury"`,
            []
          ),
          con.execute(
            `SELECT source_id FROM expenses WHERE source = "mercury"`,
            []
          ),
          con.execute(
            `SELECT source_id FROM personal_transfers WHERE source = "mercury"`,
            []
          ),
        ]).then(([a, b, c]) => {
          con.destroy();
          const txs = (a as { source_id: string }[])
            .concat(b as { source_id: string }[])
            .concat(c as { source_id: string }[]);
          return new Set(txs.map((r) => r.source_id));
        })
      );
      const apikey = account.apiToken;
      const opts = {
        headers: { Authorization: `Bearer ${apikey}` },
      };
      return axios
        .get("https://backend.mercury.com/api/v1/accounts", opts)
        .then((r) => r.data.accounts[0]?.id)
        .then((id) =>
          axios.get<{
            transactions: {
              createdAt: string;
              bankDescription: string;
              externalMemo: string;
              counterpartyName: string;
              amount: number;
              id: string;
            }[];
          }>(
            `https://backend.mercury.com/api/v1/account/${id}/transactions`,
            opts
          )
        )
        .then((r) => {
          return r.data.transactions.filter((t) => !recordedTxs.has(t.id));
        })
        .then((txs) => {
          return {
            columns: [
              { Header: "Date", accessor: "date" },
              { Header: "From", accessor: "from" },
              { Header: "To", accessor: "to" },
              { Header: "Description", accessor: "description" },
              { Header: "Amount", accessor: "amount" },
            ],
            data: txs.map((t) => ({
              date: t.createdAt,
              from: t.amount < 0 ? "ME" : t.counterpartyName,
              to: t.amount > 0 ? "ME" : t.counterpartyName,
              description: `${t.bankDescription}: ${t.externalMemo}`,
              amount: Math.abs(t.amount),
              source: "mercury",
              id: t.id,
            })),
          };
        });
    });

export default listSourceTransactions;
