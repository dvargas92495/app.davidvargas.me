import getMysqlConnection from "fuegojs/utils/mysql";

const searchRevenue = ({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) =>
  getMysqlConnection()
    .then((con) => {
      const keys = Object.keys(searchParams).filter((p) => searchParams[p]);
      return con
        .execute(
          `SELECT date, amount, product, uuid, connect, source
          FROM revenue 
          ${!keys.length ? "" : "WHERE "}${keys
            .map((k) => `${k} = ?`)
            .join(" AND ")}
          ORDER BY date`, // LIMIT ?, ?`,
          keys.map((k) => searchParams[k]) //[Number(index) * Number(size), size]
        )
        .then((a) => {
          con.destroy();
          return a;
        });
    })
    .then(([a]) => {
      const values = a as {
        date: Date;
        amount: number;
        product: string;
        uuid: string;
        connect: number;
        source: string;
      }[];
      return {
        data: values.map((v) => ({
          ...v,
          date: v.date.toLocaleString(),
          amount: `$${(v.amount / 100).toFixed(2)}`,
          connect: `$${(v.connect / 100).toFixed(2)}`,
        })),
        columns: [
          { Header: "Date", accessor: "date" },
          { Header: "Source", accessor: "source" },
          { Header: "Product", accessor: "product" },
          { Header: "Amount", accessor: "amount" },
          { Header: "Connect", accessor: "connect" },
        ],
        // count: (c as { count: number }[])[0]?.count,
      };
    });

export default searchRevenue;
