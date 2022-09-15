import getMysqlConnection from "fuegojs/utils/mysql";

const listRevenueFromStripe = () =>
  getMysqlConnection()
    .then((con) =>
      con
        .execute(`SELECT * FROM revenue WHERE source = "stripe" ORDER BY date`)
        .then((a) => {
          con.destroy();
          return a;
        })
    )
    .then(([a]) => ({
      values: (
        a as {
          uuid: string;
          source: string;
          source_id: string;
          date: Date;
          amount: number;
          product: string;
          connect: number;
        }[]
      ).map((v) => ({ ...v, date: v.date.toJSON() })),
    }));

export default listRevenueFromStripe;
