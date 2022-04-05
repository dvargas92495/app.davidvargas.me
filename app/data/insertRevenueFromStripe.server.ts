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
  return stripe.paymentIntents
    .retrieve(id, { expand: ["data.invoice"] })
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
    .then((p) => ({
      date: p.date,
      lines: p.invoice
        ? (p.invoice as Stripe.Invoice).lines.data.map((l) => ({
            product: l.price?.product as string,
            amount: l.amount - (p.fee * l.amount) / p.amount,
            connect: 0,
            id: l.id,
          }))
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
      return execute(
        `INSERT INTO revenue (uuid, source, source_id, date, amount, product, connect) VALUES ${p.lines
          .map(() => `(?, ?, ?, ?, ?, ?, ?)`)
          .join(",")}`,
        p.lines.flatMap((line) => [
          v4(),
          "stripe",
          line.id,
          new Date(p.date).toJSON(),
          line.amount,
          line.product,
          line.connect,
        ])
      );
    })
    .then(() => ({ success: true }));
};

export default insertRevenueFromStripe;
