// import getMysqlConnection from "@dvargas92495/api/mysql";
// import type mysql from "mysql2";
import axios from "axios";
import fs from "fs";

const listMercuryRecords = (
  userId: string
  // connection?: mysql.Connection
) =>
  import("@clerk/clerk-sdk-node")
    .then((clerk) => clerk.users.getUser(userId))
    .then(async (user) => {
      const account = user.publicMetadata.Mercury as {
        username: string;
        apiToken: string;
      };
      if (!account) {
        throw new Response(
          `User has not yet connected their Etherscan account`,
          {
            status: 403,
          }
        );
      }
      // const recordedTxs = new Set<string>(); 
      /*await getMysqlConnection(connection).then((con) =>
        con
          .execute(`SELECT id FROM mercury WHERE user_id = ?`, [userId])
          .then((r) => {
            const txs = r as { id: string }[];
            return new Set(txs.map((r) => r.id));
          })
      );*/
      const apikey = account.apiToken;
      return axios
          .get("https://backend.mercury.com/api/v1/accounts", {
            headers: { Authorization: `Bearer ${apikey}` },
          })
          .then((r) => r.data.accounts[0]?.id)
          .then((id) =>
            axios.get<{
              transactions: {
                createdAt: string;
                bankDescription: string;
                amount: number;
              }[];
            }>(`https://backend.mercury.com/api/v1/account/${id}/transactions`)
          )
          .then((r) => {
            fs.writeFileSync(
              "mercury.json",
              JSON.stringify(r.data, null, 4)
            );
            return r.data.transactions;
          }).then((txs) => {
        return {
          columns: [
            { Header: "Date", accessor: "date" },
            { Header: "From", accessor: "from" },
            { Header: "Description", accessor: "description" },
            { Header: "Amount", accessor: "amount" },
          ],
          data: txs.map(t => ({
            date: t.createdAt,
            from: t.bankDescription,
            description: t.bankDescription,
            amount: t.amount,
          })),
        };
      });
    });

export default listMercuryRecords;
