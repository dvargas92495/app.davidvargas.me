import getMysqlConnection from "~/package/backend/mysql.server";
import Stripe from "stripe";
import { v4 } from "uuid";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  maxNetworkRetries: 3,
  apiVersion: "2020-08-27",
});

const mappedProducts: Record<string, string> = {
  "RoamJS Site": "RoamJS Static Site",
  "SmartBlocks V2!": "RoamJS Smartblocks",
};

const insertRevenueFromStripe = async ({
  id,
  connection,
}: {
  id: string;
  connection?: Awaited<ReturnType<typeof getMysqlConnection>>;
}): Promise<{
  values: {
    uuid: string;
    source: string;
    source_id: string;
    date: Date;
    amount: number;
    description: string;
  }[];
}> => {
  const execute = connection
    ? connection.execute
    : await getMysqlConnection().then((m) => m.execute);
  return execute(
    `SELECT * FROM events WHERE source = "stripe" AND source_id = ?`,
    [id]
  ).then((a) => {
    const records = a as {
      uuid: string;
      source: string;
      source_id: string;
      date: Date;
      amount: number;
      description: string;
    }[];
    if (records.length) {
      return { values: records };
    }
    return stripe.paymentIntents
      .retrieve(id, { expand: ["invoice"] })
      .then((p) => {
        if (p.metadata.Test === "true") {
          console.log(`Not Recording test transaction`, id);
          return { values: [] };
        }
        if (!p.charges.data.length) {
          console.log(`Not Recording chargeless transaction`, id);
          return { values: [] };
        }
        const [charge] = p.charges.data;
        if (charge.refunded) {
          console.log(`Not Recording refunded transaction`, id);
          return { values: [] };
        }
        return Promise.all([
          stripe.balanceTransactions
            .retrieve(charge.balance_transaction as string)
            .then((t) => t.fee),
          stripe.checkout.sessions
            .list({ payment_intent: p.id })
            .then((r) => r.data?.[0]),
        ])
          .then(([fee, checkout]) => ({
            id: p.id,
            amount: p.amount,
            date: new Date(charge.created * 1000),
            fee,
            invoice: p.invoice as Stripe.Invoice,
            checkout,
            metadata: p.metadata,
          }))
          .then(async (p) => ({
            date: p.date,
            lines: p.invoice
              ? await Promise.all(
                  (p.invoice as Stripe.Invoice).lines.data.map((l) =>
                    stripe.products
                      .retrieve(l.price?.product as string)
                      .then((product) => ({
                        product: product.name,
                        amount: l.amount - (p.fee * l.amount) / p.amount,
                        id: l.id,
                      }))
                  )
                )
              : p.checkout
              ? await stripe.checkout.sessions
                  .listLineItems(p.checkout.id)
                  .then((c) =>
                    Promise.all(
                      c.data.map((l) =>
                        stripe.products
                          .retrieve(l.price?.product as string)
                          .then((product) => ({
                            product: product.name,
                            amount:
                              l.amount_subtotal -
                              (p.fee * l.amount_subtotal) / p.amount,
                            id: l.id,
                          }))
                      )
                    )
                  )
              : (charge.application_fee_amount || 0) > 0
              ? [
                  {
                    product: "RoamJS Smartblocks",
                    amount: (charge.application_fee_amount || 0) - p.fee,
                    // connect:
                    //   charge.amount - (charge.application_fee_amount || 0),
                    id: p.id,
                  },
                ]
              : p.metadata.source
              ? [
                  {
                    product: p.metadata.source,
                    amount: charge.amount,
                    id: p.id,
                  },
                ]
              : [
                  {
                    product: "Unknown",
                    amount: charge.amount,
                    id: p.id,
                  },
                ],
          }))
          .then((r) => {
            // write to mysql
            const values = r.lines.map((line) => ({
              uuid: v4(),
              source: "stripe",
              source_id: line.id,
              date: new Date(r.date),
              amount: line.amount,
              description: mappedProducts[line.product] || line.product,
            }));
            return execute(
              `INSERT INTO events (uuid, source, source_id, date, amount, description, code) VALUES ${values
                .map(() => `(?, ?, ?, ?, ?, ?, ?)`)
                .join(",")} ON DUPLICATE KEY UPDATE amount=amount`,
              values.flatMap((v) => [
                v.uuid,
                v.source,
                v.source_id,
                v.date,
                v.amount,
                v.description,
                4300,
              ])
            )
              .then(() => ({
                values,
              }))
              .catch(() => {
                console.error("Failed to insert revenue records for id:", id);
                console.error(JSON.stringify(values, null, 4));
                // swallow error bc of old migrations
                return {
                  values: [],
                };
              });
          });
      });
  });
};

export default insertRevenueFromStripe;
