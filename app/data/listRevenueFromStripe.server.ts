import getMysqlConnection from "@dvargas92495/api/mysql";

const listRevenueFromStripe = () =>
  getMysqlConnection()
    .then((con) =>
      con.execute(`SELECT * FROM revenue WHERE source = "stripe"`).then((a) => {
        con.destroy();
        return a;
      })
    )
    .then((a) => ({
      values: a as {
        uuid: string;
        source: string;
        source_id: string;
        date: Date;
        amount: number;
        product: string;
        connect: number;
      }[],
    }));

export default listRevenueFromStripe;
