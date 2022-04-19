import getMysqlConnection from "@dvargas92495/api/mysql";
// import axios from "axios";
import type mysql from "mysql2";

const listMercuryRecords = (userId: string, connection?: mysql.Connection) =>
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
      const recordedTxs = await getMysqlConnection(connection).then((con) =>
        con
          .execute(`SELECT id FROM mercury WHERE user_id = ?`, [userId])
          .then((r) => {
            const txs = r as { id: string }[];
            return new Set(txs.map((r) => r.id));
          })
      );
      const apikey = account.apiToken;
      return Promise.all([
        Promise.resolve(recordedTxs),
        Promise.resolve([apikey]),
      ]).then(([]) => {
        return {
          columns: [
            { Header: "Date", accessor: "date" },
            { Header: "From", accessor: "from" },
            { Header: "Description", accessor: "description" },
            { Header: "Amount", accessor: "amount" },
          ],
          data: [],
        };
      });
    });

export default listMercuryRecords;
