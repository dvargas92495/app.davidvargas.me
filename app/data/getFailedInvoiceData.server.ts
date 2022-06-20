import Stripe from "stripe";
import { z } from "zod";
import { BadRequestResponse } from "~/package/backend/responses.server";

const getFailedInvoiceData = (invoice: Stripe.Invoice, stripe: Stripe) => {
  invoice.charge;
  return Promise.all([
    stripe.customers.retrieve(invoice.customer as string),
    invoice.subscription
      ? stripe.subscriptions
          .retrieve(invoice.subscription as string)
          .then((sub) => sub.metadata.project)
      : invoice.lines.data[0]?.description,
    stripe.charges.retrieve(invoice.charge as string),
  ]).then(([c, project, charge]) => ({
    customerEmail: c.deleted
      ? "dvargas92495@gmail.com"
      : c.email || "dvargas92495@gmail.com",
    customerName: c.deleted ? "Deleted Customer" : c.name || "Unknown Customer",
    url: "https://roamjs.com",
    project,
    reason: charge.failure_message || "reasons unknown",
  }));
};

export const remixAdapter = ({
  params,
}: {
  params: Record<string, string | undefined>;
}) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    maxNetworkRetries: 3,
    apiVersion: "2020-08-27",
  });
  try {
    const data = z
      .object({
        id: z.string(),
      })
      .parse(params);
    return stripe.events.retrieve(data.id).then((event) => {
      if (event.type !== "invoice.payment_failed") {
        throw new BadRequestResponse(
          `Event id ${data.id} must be an invoice.payment_failed event`
        );
      }
      return getFailedInvoiceData(event.data.object as Stripe.Invoice, stripe);
    });
  } catch (e) {
    throw new Response((e as Error).message, { status: 500 });
  }
};

export default getFailedInvoiceData;
