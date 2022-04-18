import getMysqlConnection from "@dvargas92495/api/mysql";

const searchRevenue = ({
  searchParams: { index = "0", size = "10" },
}: {
  searchParams: Record<string, string>;
}) =>
  getMysqlConnection()
    .then((con) =>
      con
        .execute(
          `SELECT date, amount, product, uuid FROM revenue ORDER BY date LIMIT ?, ?`,
          [Number(index) * Number(size), size]
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
      }[];
      return { values: values.map((v) => ({ ...v, date: v.date.valueOf() })) };
    });

export default searchRevenue;
