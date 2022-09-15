import getMysqlConnection from "~/package/backend/mysql.server";
import type { MigrationProps } from "fuegojs/types";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  maxNetworkRetries: 3,
  apiVersion: "2020-08-27",
});

export const migrate = (args: MigrationProps) =>
  getMysqlConnection(args.connection).then((connection) =>
    connection
      .execute(`SELECT source_id, date FROM revenue WHERE source = "stripe"`)
      .then((s) =>
        (s as { source_id: string; date: Date }[]).filter((s) =>
          s.source_id.startsWith("il_")
        )
      )
      .then((invs) =>
        invs
          .map(
            (i, index) => () =>
              stripe.invoiceItems
                .retrieve(i.source_id, { expand: ["invoice.payment_intent"] })
                .then(
                  (inv) =>
                    (
                      (inv.invoice as Stripe.Invoice)
                        .payment_intent as Stripe.PaymentIntent
                    ).charges.data[0].created
                )
                .then((date) =>
                  connection
                    .execute(
                      `UPDATE revenue SET date = ? WHERE source_id = ? AND source = "stripe"`,
                      [new Date(date * 1000), i.source_id]
                    )
                    .then(() =>
                      console.log(
                        "Updated",
                        i.source_id,
                        "from",
                        i.date.toJSON(),
                        "to",
                        new Date(date * 1000),
                        "-",
                        index,
                        "/",
                        invs.length
                      )
                    )
                )
          )
          .reduce((p, c) => p.then(c), Promise.resolve())
          .then(() => console.log("Updated", invs.length, "records"))
      )
  );

export const revert = () => {
  return Promise.resolve();
};
