import getMysqlConnection from "~/package/backend/mysql.server";

const searchRevenue = ({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) =>
  getMysqlConnection()
    .then((con) => {
      const keys = Object.keys(searchParams).filter(
        (p) => searchParams[p] && !["size", "offset"].includes(p)
      );
      const size = searchParams["size"] || "10";
      const offset = searchParams["offset"] || "0";
      return con
        .execute(
          `SELECT date, amount, description, uuid, code, source
          FROM events 
          ${!keys.length ? "" : "WHERE "}${keys
            .map((k) => `${k} = ?`)
            .join(" AND ")}
          ORDER BY date LIMIT ?, ?`,
          keys
            .map((k) => searchParams[k])
            .concat(
              [Number(offset) * Number(size), size].map((n) => n.toString())
            )
        )
        .then((a) => {
          con.destroy();
          return a;
        });
    })
    .then((a) => {
      const values = a as {
        date: Date;
        amount: number;
        description: string;
        uuid: string;
        code: number;
        source: string;
      }[];
      return {
        data: values.map((v) => ({
          ...v,
          date: v.date.toLocaleString(),
          amount: `$${(v.amount / 100).toFixed(2)}`,
        })),
        columns: [
          { Header: "Date", accessor: "date" },
          { Header: "Source", accessor: "source" },
          { Header: "Description", accessor: "description" },
          { Header: "Amount", accessor: "amount" },
          { Header: "Code", accessor: "code" },
        ],
        // count: (c as { count: number }[])[0]?.count,
      };
    });

export default searchRevenue;
