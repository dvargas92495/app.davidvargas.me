import getMysqlConnection from "@dvargas92495/api/mysql";

const searchRevenue = ({
  searchParams: { index = "0", size = "10" },
}: {
  searchParams: Record<string, string>;
}) =>
  getMysqlConnection()
    .then((con) =>
      Promise.all([
        con.execute(
          `SELECT date, amount, product, uuid, connect FROM revenue ORDER BY date LIMIT ?, ?`,
          [Number(index) * Number(size), size]
        ),
        con.execute(`SELECT COUNT(uuid) as count FROM revenue`),
      ]).then((a) => {
        con.destroy();
        return a;
      })
    )
    .then(([a, c]) => {
      const values = a as {
        date: Date;
        amount: number;
        product: string;
        uuid: string;
      }[];
      return {
        data: values.map((v) => ({ ...v, date: v.date.toLocaleString() })),
        columns: [
          { Header: "Date", accessor: "date" },
          { Header: "Product", accessor: "product" },
          { Header: "Amount", accessor: "amount" },
          { Header: "Connect", accessor: "connect" },
        ],
        count: (c as { count: number }[])[0]?.count,
      };
    });

export default searchRevenue;
// 0x82df1973bfb40faf04c5382d920ad7e0f0f148477a1ff4356f9d4ef8f942037b
// 0x82df1973bfb40faf04c5382d920ad7e0f0f148477a1ff4356f9d4ef8f942037b
// 0x5db19b45e7c20077b8abb9e661ac97c5c9f5d871c9268af29fd4b1f312d701b1
// 0x5db19b45e7c20077b8abb9e661ac97c5c9f5d871c9268af29fd4b1f312d701b1