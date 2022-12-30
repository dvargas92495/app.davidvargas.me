import getMysqlConnection from "fuegojs/utils/mysql";

const searchEvents = ({
  searchParams,
  context: { requestId },
}: {
  searchParams: Record<string, string>;
  context: { requestId: string };
}) =>
  getMysqlConnection(requestId)
    .then((con) => {
      const keys = Object.keys(searchParams).filter(
        (p) => searchParams[p] && !["size", "index"].includes(p)
      );
      const size = searchParams["size"] || "10";
      const index = searchParams["index"] || "0";
      const args = keys
        .map((k) => searchParams[k] as string | number)
        .concat([Number(index) * Number(size), size]);
      return Promise.all([
        con.execute(
          `SELECT date, amount, description, uuid, code, source
          FROM events 
          ${!keys.length ? "" : "WHERE "}${keys
            .map((k) => `${k} = ?`)
            .join(" AND ")}
          ORDER BY date DESC LIMIT ?, ?`,
          process.env.NODE_ENV === "development"
            ? args.map((n) => n.toString())
            : args
        ),
        con.execute(`SELECT COUNT(uuid) as count FROM events`),
      ]).then((a) => {
        con.destroy();
        return a;
      });
    })
    .then(([[a], [l]]) => {
      const values = a as {
        date: Date;
        amount: number;
        description: string;
        uuid: string;
        code: number;
        source: string;
      }[];
      const [{ count }] = l as { count: number }[];
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
        count,
      };
    });

export default searchEvents;
