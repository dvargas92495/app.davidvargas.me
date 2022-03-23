import insertRevenueFromStripe from "../data/insertRevenueFromStripe.server";
import Stripe from "stripe";
import type mysql from "mysql2";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  maxNetworkRetries: 3,
  apiVersion: "2020-08-27",
});

const paymentIntents: string[] = [];
const collect = (starting_after?: string): Promise<number> =>
  stripe.paymentIntents.list({ limit: 100, starting_after }).then((r) => {
    paymentIntents.push(
      ...r.data.filter(({ status }) => status === "succeeded").map((p) => p.id)
    );
    if (r.has_more) return collect(r.data.slice(-1)[0].id);
    else return paymentIntents.length;
  });

export const migrate = ({ connection }: { connection: mysql.Connection }) =>
  collect()
    .then((d) => console.log("there are", d, "ids to migrate"))
    .then(() =>
      Promise.all(
        paymentIntents.map((id) => insertRevenueFromStripe({ id, connection }))
      )
    )
    .then(() => console.log("done"));
