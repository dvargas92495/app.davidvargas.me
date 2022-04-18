import getMysqlConnection from "@dvargas92495/api/mysql";

const searchTransfers = ({
  searchParams: { index = "0", size = "10" },
}: {
  searchParams: Record<string, string>;
}) =>
  getMysqlConnection()
    .then((con) =>
      Promise.all([
        con.execute(
          `SELECT date, amount, description, uuid, code FROM personal_transfers ORDER BY date LIMIT ?, ?`,
          [Number(index) * Number(size), size]
        ),
        con.execute(`SELECT COUNT(uuid) as count FROM personal_transfers`),
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
          { Header: "Description", accessor: "description" },
          { Header: "Amount", accessor: "amount" },
          { Header: "Code", accessor: "code" },
        ],
        count: (c as { count: number }[])[0]?.count,
      };
    });

export default searchTransfers;
