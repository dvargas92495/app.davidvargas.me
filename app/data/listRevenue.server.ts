import getMysqlConnection from "fuegojs/utils/mysql";

const listRevenue = () =>
  getMysqlConnection()
    .then((con) =>
      con
        .execute(
          `SELECT date, amount, description FROM events WHERE code >= 4000 AND code < 5000 ORDER BY date`
        )
        .then((a) => {
          con.destroy();
          return a;
        })
    )
    .then(([a]) => {
      const values = a as {
        date: Date;
        amount: number;
        description: string;
      }[];
      return {
        values: values.map((v) => ({
          date: v.date.valueOf(),
          amount: v.amount,
          product: v.description,
        })),
      };
    });

export default listRevenue;
