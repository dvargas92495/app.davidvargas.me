import getMysqlConnection from "~/package/backend/mysql.server";

const searchRevenue = ({
  searchParams: {
    // index = "0",
    // size = "10",
    product = "",
  },
}: {
  searchParams: Record<string, string>;
}) =>
  getMysqlConnection()
    .then((con) =>
      con
        .execute(
          `SELECT date, amount, product, uuid, connect, source
          FROM revenue 
          ${product ? "WHERE product = ?" : ""}
          ORDER BY date`, // LIMIT ?, ?`,
          product ? [product] : [] //[Number(index) * Number(size), size]
        )
        .then((a) => {
          con.destroy();
          return a;
        })
    )
    .then((a) => {
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
