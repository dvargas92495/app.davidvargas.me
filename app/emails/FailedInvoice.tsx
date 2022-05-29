import React from "react";

const FailedInvoice = ({
  id,
  customerName,
  customerEmail,
  url,
  project,
  reason,
}: {
  id: string;
  customerName: string;
  customerEmail: string;
  project: string;
  reason: string;
  url: string;
}): React.ReactElement => {
  const userLink = `${url}/user`;
  return (
    <div
      style={{
        margin: "0 auto",
        maxWidth: 600,
        fontFamily: `"Proxima Nova","proxima-nova",Helvetica,Arial sans-serif`,
        padding: `20px 0`,
      }}
    >
      <div
        style={{
          width: "80%",
          margin: "0 auto",
          paddingBottom: 20,
          borderBottom: "1px dashed #dadada",
          textAlign: "center",
        }}
      >
        <img
          src={`${url}/favicon.ico`}
          width={128}
          style={{ display: "inline-block" }}
        />
      </div>
      <div
        style={{
          width: "80%",
          margin: "30px auto",
          fontSize: 16,
        }}
      >
        <p style={{ marginBottom: 16 }}>
          A user failed to pay their latest invoice.
        </p>
        <p style={{ marginBottom: 16 }}>
          <a
            href={`https://dashboard.stripe.com/events/${id}`}
            style={{ color: "#3ba4dc", textDecoration: "underline" }}
          >
            Click here for more info.
          </a>
        </p>
        <p style={{ marginBottom: 16 }}>Here's what I would send to {customerEmail}:</p>
        <h1 style={{ fontSize: 32, fontWeight: 600, marginBottom: 32 }}>
          Failed to pay latest invoice
        </h1>
        <p style={{ marginBottom: 32 }}>Hey {customerName},</p>
        <p style={{ marginBottom: 16 }}>
          The latest payment for your subscription to {project} failed because
          of the following error: "{reason}". Are you still interested in
          remaining subscribed? If so, please update your card at{" "}
          <a
            href={userLink}
            style={{ color: "#3ba4dc", textDecoration: "underline" }}
          >
            {userLink}
          </a>
          .
        </p>
        <p style={{ marginTop: 32 }}>Best,</p>
        <p>Vargas</p>
      </div>
      <div
        style={{
          width: "80%",
          margin: "30px auto",
          borderTop: "1px dashed #dadada",
          display: "flex",
          color: "#a8a8a8",
          paddingTop: 15,
        }}
      >
        <div style={{ width: "50%" }}>
          Sent From{" "}
          <a
            href="https://davidvargas.me"
            style={{ color: "#3ba4dc", textDecoration: "none" }}
          >
            Vargas Arts
          </a>
        </div>
        <div style={{ width: "50%", textAlign: "right" }}>
          <a
            href="mailto:hello@davidvargas.me"
            style={{ color: "#3ba4dc", textDecoration: "none" }}
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default FailedInvoice;
