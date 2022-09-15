import getMysqlConnection from "~/package/backend/mysql.server";
import type { MigrationProps } from "fuegojs/types";

export const migrate = ({ connection }: MigrationProps) => {
  return getMysqlConnection(connection).then((connection) =>
    connection.execute(
      `UPDATE revenue 
       SET product = "RoamJS Sponsor" 
       WHERE product IN (
         "RoamJS Contribute",
         "RoamJS Docs smartblocks"
       )`
    )
  );
};

export const revert = () => {
  // the way to actually do this would be to query stripe for reverting the records
  // a lot of work and low value, so we just skip
  return Promise.resolve();
};
