import getMysqlConnection from "~/package/backend/mysql.server";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
//   maxNetworkRetries: 3,
//   apiVersion: "2020-08-27",
// });

const getRevenue = (uuid: string) =>
  getMysqlConnection()
    .then((con) =>
      con.execute(`SELECT * FROM revenue WHERE uuid = ?`, [uuid]).then((a) => {
        con.destroy();
        return a;
      })
    )
    .then((a) => {
      return (
        a as {
          uuid: string;
          source: string;
          source_id: string;
          date: Date;
          amount: number;
          product: string;
          connect: number;
        }[]
      )[0];
    });

export default getRevenue;
