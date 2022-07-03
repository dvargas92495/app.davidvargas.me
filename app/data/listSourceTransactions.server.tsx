import axios from "axios";
import getMysqlConnection from "~/package/backend/mysql.server";
import dateFnsFormat from "date-fns/format";
import { z } from "zod";
import { MethodNotAllowedResponse } from "~/package/backend/responses.server";

const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24;

const schema = z.object({
  date: z
    .string()
    .optional()
    .default(new Date().toJSON())
    .transform((s) => {
      return new Date(s);
    }),
  range: z.string().optional().default("30").transform(Number),
});

const listSourceTransactions = ({
  userId,
  searchParams,
}: {
  userId: string;
  searchParams: Record<string, string>;
}) =>
  import("@clerk/clerk-sdk-node")
    .then((clerk) => clerk.users.getUser(userId))
    .then(async (user) => {
      const account = user.publicMetadata.Mercury as {
        username: string;
        apiToken: string;
      };
      const { date, range } = schema.parse(searchParams);
      if (!account) {
        throw new MethodNotAllowedResponse(
          `User has not yet connected their Mercury account`
        );
      }
      const startDate = new Date(date.valueOf() - range * MILLISECONDS_IN_DAY);
      const recordedTxs = await getMysqlConnection().then((con) =>
        con
          .execute(
            `SELECT source_id, source FROM events WHERE date >= ? AND date <= ?`,
            [startDate, date]
          )
          .then((a) => {
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
      const { mercury = new Set() } = recordedTxs;
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
            `https://backend.mercury.com/api/v1/account/${id}/transactions?end=${date.toISOString()}&start=${startDate.toISOString()}`,
            opts
          )
        )
        .then((r) => {
          return r.data.transactions.filter((t) => !mercury.has(t.id));
        })
        .then((txs) => {
          return {
            columns: [
              { Header: "Source", accessor: "source" },
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
              amount: t.amount,
              source: "mercury",
              id: t.id,
            })),
          };
        });
    });

export default listSourceTransactions;
