import axios from "axios";
import getMysqlConnection from "~/package/backend/mysql.server";
import dateFnsFormat from "date-fns/format";

const listSourceTransactions = ({
  userId,
}: // searchParams,
{
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
        con.execute(`SELECT source_id, source FROM events`, []).then((a) => {
          con.destroy();
          const txs = a as { source_id: string; source: string }[];
          return txs.reduce((p, c) => {
            if (p[c.source]) {
              p[c.source].add(c.source_id);
            } else {
              p[c.source] = new Set([c.source_id]);
            }
            return p;
          }, {} as Record<string, Set<string>>);
        })
      );
      const apikey = account.apiToken;
      const opts = {
        headers: { Authorization: `Bearer ${apikey}` },
      };
      const { mercury } = recordedTxs;
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
              note: string;
            }[];
          }>(
            `https://backend.mercury.com/api/v1/account/${id}/transactions`,
            opts
          )
        )
        .then((r) => {
          return r.data.transactions.filter((t) => !mercury.has(t.id));
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
              date: dateFnsFormat(new Date(t.createdAt), "yyyy-MM-dd hh:mm a"),
              from: t.amount < 0 ? "ME" : t.counterpartyName,
              to: t.amount > 0 ? "ME" : t.counterpartyName,
              description: `Bank Description: ${t.bankDescription}\nExternal Memo: ${t.externalMemo}\nNote: ${t.note}`,
              amount: Math.abs(t.amount),
              source: "mercury",
              id: t.id,
            })),
          };
        });
    });

export default listSourceTransactions;
