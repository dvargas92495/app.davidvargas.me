import insertRevenueFromStripe from "../../app/data/insertRevenueFromStripe.server";
import Stripe from "stripe";
import type { MigrationProps } from "fuegojs/types";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  maxNetworkRetries: 3,
  apiVersion: "2022-11-15",
});

const paymentIntents: string[] = [];
const collect = (starting_after?: string): Promise<number> => {
  console.log("querying after", starting_after);
  return stripe.paymentIntents
    .list({ limit: 100, starting_after })
    .then((r) => {
      paymentIntents.push(
        ...r.data
          .filter(({ status }) => status === "succeeded")
          .map((p) => p.id)
      );
      console.log("we now have", paymentIntents.length, "payments");
      if (r.has_more) return collect(r.data.slice(-1)[0].id);
      else return paymentIntents.length;
    });
};

export const migrate = ({ connection }: MigrationProps) =>
  collect()
    .then((d) => console.log("there are", d, "ids to migrate"))
    .then(() =>
      paymentIntents
        .map(
          (id) => () =>
            insertRevenueFromStripe({ id, connection }).then(() =>
              console.log("Recorded stripe id", id)
            )
        )
        .reduce((p, c) => p.then(c), Promise.resolve())
    )
    .then(() => console.log("done"));

export const revert = ({ connection }: MigrationProps) =>
  connection.execute(`DELETE FROM revenue`);
