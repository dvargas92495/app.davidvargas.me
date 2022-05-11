import getMysqlConnection from "~/package/backend/mysql.server";

const listRevenue = () =>
  getMysqlConnection()
    .then((con) =>
      con
        .execute(`SELECT date, amount, product FROM revenue ORDER BY date`)
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

export default listRevenue;
