import getMysqlConnection from "fuegojs/utils/mysql";
import insertRevenueFromStripe from "~/data/insertRevenueFromStripe.server";
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import axios, { AxiosError, AxiosRequestHeaders } from "axios";
import Stripe from "stripe";
import sendEmail from "~/package/backend/sendEmail.server";
import React from "react";
import FailedInvoice from "~/emails/FailedInvoice";
import getFailedInvoiceData from "~/data/getFailedInvoiceData.server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  maxNetworkRetries: 3,
  apiVersion: "2022-11-15",
});

const normalizeHeaders = (
  hdrs: APIGatewayProxyEvent["headers"]
): AxiosRequestHeaders =>
  Object.fromEntries(
    Object.entries(hdrs)
      .map(([h, v]) => [h.toLowerCase(), v || ""])
      .filter(([, v]) => !!v)
  );

export const handler: APIGatewayProxyHandler = async (event) => {
  const headers = normalizeHeaders(event.headers);
  const { ["stripe-signature"]: sig } = headers;
  const stripeEvent = stripe.webhooks.constructEvent(
    event.body || "{}",
    sig || "",
    process.env.STRIPE_WEBHOOK_SECRET || ""
  );
  const {
    type,
    data: { object },
    id,
  } = stripeEvent;
  return (
    type === "payment_intent.succeeded"
      ? getMysqlConnection().then((connection) =>
          insertRevenueFromStripe({
            id: (object as Stripe.PaymentIntent).id,
            connection,
          }).then(() => connection.destroy())
        )
      : type === "payment_method.attached"
      ? stripe.customers
          .retrieve((object as Stripe.PaymentMethod).customer as string)
          .then((c) => c as Stripe.Customer)
          .then((c) => c.invoice_settings.default_payment_method as string)
          .then((dpm) =>
            dpm
              ? Promise.resolve()
              : stripe.customers
                  .update((object as Stripe.PaymentMethod).customer as string, {
                    invoice_settings: {
                      default_payment_method: (object as Stripe.PaymentMethod)
                        .id,
                    },
                  })
                  .then(() => Promise.resolve())
          )
      : type === "invoice.payment_failed"
      ? getFailedInvoiceData(object as Stripe.Invoice, stripe).then((args) =>
          sendEmail({
            to: "dvargas92495@gmail.com",
            subject: "Invoice Failed",
            body: React.createElement(FailedInvoice, {
              id,
              ...args,
            }),
          })
        )
      : Promise.resolve()
  )
    .then(() => {
      const metadata = (object as { metadata: Stripe.Metadata }).metadata;
      if (metadata?.callback) {
        return axios
          .post(
            metadata.callback,
            { body: event.body },
            {
              headers: Object.fromEntries(
                Object.entries(headers).filter(([h]) => h !== "host")
              ),
            }
          )
          .then((r) => ({
            body: r.data,
            statusCode: r.status,
            headers: r.headers,
          }))
          .catch((e: AxiosError) => {
            return Promise.reject({
              statusCode: e.response?.status || 500,
              message:
                typeof e.response?.data === "object"
                  ? JSON.stringify(e.response?.data)
                  : e.response?.data || e.message,
              headers: e.response?.headers || {},
            });
          });
      }
      return {
        body: { calbackFound: false },
        statusCode: 200,
        headers: {},
      };
    })
    .then(({ statusCode, headers, body }) => ({
      statusCode,
      headers,
      body: JSON.stringify(body),
    }))
    .catch((e) =>
      sendEmail({
        to: "dvargas92495@gmail.com",
        subject: "Stripe Webhook Failed",
        body: React.createElement(
          "div",
          {
            style: {
              margin: "0 auto",
              maxWidth: 600,
              fontFamily: `"Proxima Nova","proxima-nova",Helvetica,Arial sans-serif`,
              padding: `20px 0`,
            },
          },
          React.createElement(
            "div",
            {
              style: {
                width: "80%",
                margin: "0 auto",
                paddingBottom: 20,
                borderBottom: "1px dashed #dadada",
                textAlign: "center",
              },
            },
            React.createElement("img", {
              src: "https://davidvargas.me/favicon.ico",
              width: 128,
            })
          ),
          React.createElement(
            "div",
            {
              style: {
                width: "80%",
                margin: "30px auto",
                fontSize: 16,
              },
            },
            React.createElement(
              "h3",
              {},
              `An error was thrown in the Stripe Global Webhook`
            ),
            React.createElement(
              "p",
              {},
              `${e.name}: ${
                typeof e.response?.data === "object"
                  ? e.response.data.message || JSON.stringify(e.response.data)
                  : e.response?.data || e.message
              }`
            ),
            React.createElement("p", {}, e.stack)
          ),
          React.createElement(
            "div",
            {
              style: {
                width: "80%",
                margin: "30px auto",
                borderTop: "1px dashed #dadada",
                display: "flex",
                color: "#a8a8a8",
                paddingTop: 15,
              },
            },
            React.createElement(
              "div",
              { style: { width: "50%" } },
              "Sent From ",
              React.createElement(
                "a",
                {
                  href: "https://davidvargas.me",
                  style: { color: "#3ba4dc", textDecoration: "none" },
                },
                "Vargas Arts"
              )
            ),
            React.createElement(
              "div",
              { style: { width: "50%", textAlign: "right" } },
              React.createElement(
                "a",
                {
                  href: "mailto:hello@davidvargas.me",
                  style: { color: "#3ba4dc", textDecoration: "none" },
                },
                "Contact Support"
              )
            )
          )
        ),
      })
        .then(() => ({
          statusCode: e.statusCode || 500,
          body: e.message,
          headers: e.headers || {},
        }))
        .catch((err) => ({
          statusCode: 500,
          body: `Failed to send webhook failure email: ${err.message}\nOriginal: ${e?.message}`,
        }))
    );
};
