import getMysqlConnection from "@dvargas92495/api/mysql";
import Stripe from "stripe";
import { v4 } from "uuid";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  maxNetworkRetries: 3,
  apiVersion: "2020-08-27",
});

const insertRevenueFromStripe = async ({
  id,
  connection,
}: {
  id: string;
  connection?: Awaited<ReturnType<typeof getMysqlConnection>>;
}) => {
  const execute = connection
    ? connection.execute
    : await getMysqlConnection().then((m) => m.execute);
  return execute(
    `SELECT * FROM revenue WHERE source = "stripe" AND source_id = ?`,
    [id]
  ).then((a) => {
    const records = a as {
      uuid: string;
      source: string;
      source_id: string;
      date: Date;
      amount: number;
      product: string;
      connect: number;
    }[];
    if (records.length) {
      return { values: records };
    }
    return stripe.paymentIntents
      .retrieve(id, { expand: ["invoice"] })
      .then(async (p) => ({
        id: p.id,
        amount: p.amount,
        charges: p.charges,
        date: new Date(p.created * 1000),
        fee: await stripe.balanceTransactions
          .retrieve(p.charges.data[0].balance_transaction as string)
          .then((t) => t.fee),
        invoice: p.invoice as Stripe.Invoice,
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
                    connect: 0,
                    id: l.id,
                  }))
              )
            )
          : [
              {
                product: "RoamJS Smartblocks",
                amount: (p.charges.data[0].application_fee_amount || 0) - p.fee,
                connect:
                  p.charges.data[0].amount -
                  (p.charges.data[0].application_fee_amount || 0),
                id: p.id,
              },
            ],
      }))
      .then((p) => {
        // write to mysql
        const values = p.lines.map((line) => ({
          uuid: v4(),
          source: "stripe",
          source_id: line.id,
          date: new Date(p.date),
          amount: line.amount,
          product: line.product,
          connect: line.connect,
        }));
        return execute(
          `INSERT INTO revenue (uuid, source, source_id, date, amount, product, connect) VALUES ${values
            .map(() => `(?, ?, ?, ?, ?, ?, ?)`)
            .join(",")}`,
          values.flatMap((v) => [
            v.uuid,
            v.source,
            v.source_id,
            v.date,
            v.amount,
            v.product,
            v.connect,
          ])
        ).then(() => ({ values }));
      });
  });
};

export default insertRevenueFromStripe;
