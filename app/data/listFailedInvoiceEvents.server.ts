import Stripe from "stripe";

const listFailedInvoiceEvents = () => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    maxNetworkRetries: 3,
    apiVersion: "2022-11-15",
  });
  return stripe.events
    .list({ type: "invoice.payment_failed" })
    .then((events) => ({
      events: events.data.map((e) => ({
        id: e.id,
        label: new Date(e.created * 1000).toLocaleString(),
      })),
    }));
};

export default listFailedInvoiceEvents;
