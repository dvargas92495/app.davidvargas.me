import type { MigrationProps } from "fuegojs/dist/migrate";
import getMysqlConnection from "~/package/backend/mysql.server";
import insertRevenueFromStripe from "~/data/insertRevenueFromStripe.server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  maxNetworkRetries: 3,
  apiVersion: "2020-08-27",
});

export const migrate = ({ connection }: MigrationProps) => {
  return getMysqlConnection(connection).then((connection) =>
    Promise.all([
      connection.execute(
        `UPDATE revenue 
       SET product = "RoamJS Freelancing" 
       WHERE product IN (
         "RoamJS Consulting",
         "RoamJS Freelance (1.5 milestones)",
         "RoamJS Milestone",
         "RoamJS Discourse Graph Milestone",
         "RoamJS Freelance",
         "Moving TODOs",
         "RoamJS Relay Game",
         "RoamJS Grain Milestones",
         "RoamJS Grain Integration Milestone",
         "RoamJS Relay",
         "Presentation Extension"
       )`
      ),
      connection.execute(
        `UPDATE revenue 
       SET product = "RoamJS Static Site" 
       WHERE product IN (
         "RoamJS Site",
         "RoamJS Scholarship"
       )`
      ),
      connection.execute(
        `UPDATE revenue 
       SET product = "RoamJS Twitter" 
       WHERE product IN (
         "RoamJS Social"
       )`
      ),
      connection.execute(
        `UPDATE revenue 
       SET product = "RoamJS Sponsor" 
       WHERE product IN (
         "RoamJS Contribute",
         "RoamJS Docs smartblocks"
       )`
      ),
      connection
        .execute(
          `SELECT source_id 
          FROM revenue 
          WHERE product IN ("RoamJS Smartblocks", "Unknown")`
        )
        .then((a) => a as { source_id: string }[])
        .then((records) => {
          console.log("updating", records.length, "records");
          return records
            .filter((r) => r.source_id.startsWith("pi_"))
            .map(
              (r) => () =>
                connection
                  .execute(
                    `DELETE FROM revenue WHERE source = "Stripe" AND source_id = ?`,
                    [r.source_id]
                  )
                  .then(
                    () =>
                      insertRevenueFromStripe({
                        id: r.source_id,
                        connection,
                      })
                    //  )
                  )
                  .then(({ values }) =>
                    Promise.all(
                      values
                        .filter(
                          (v) =>
                            v.description === "Unknown" &&
                            v.source_id.startsWith("pi_")
                        )
                        .map((v) =>
                          stripe.paymentIntents
                            .retrieve(v.source_id)
                            .then((p) => ({
                              uuid: v.uuid,
                              project: p.metadata.product,
                            }))
                        )
                    )
                  )
                  .then((intents) =>
                    intents.filter(
                      (i) =>
                        i.project === "da4f0582-dee8-4da6-84c5-22cb3933a8ce"
                    )
                  )
                  .then((intents) =>
                    intents.length
                      ? connection
                          .execute(
                            `UPDATE revenue 
                   SET product = "RoamJS Smartblocks" 
                   WHERE product IN (
                     ${intents.map(() => "?").join(",")}
                   )`,
                            intents.map((i) => i.uuid)
                          )
                          .then(() => Promise.resolve())
                      : Promise.resolve()
                  )
                  .then(() => console.log("updated", r.source_id))
            )
            .reduce((p, c) => p.then(c), Promise.resolve());
        }),
    ]).then(() =>
      connection.execute(
        `UPDATE revenue 
     SET product = "RoamJS Freelancing" 
     WHERE product IN (
       "Unknown"
     )`
      )
    )
  );
};

export const revert = () => {
  // the way to actually do this would be to query stripe for reverting the records
  // a lot of work and low value, so we just skip
  return Promise.resolve();
};
