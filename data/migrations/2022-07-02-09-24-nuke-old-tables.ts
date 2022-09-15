import type { MigrationProps } from "fuegojs/types";
import getMysqlConnection from "~/package/backend/mysql.server";

export const migrate = (args: MigrationProps) => {
  return getMysqlConnection(args.connection).then((con) =>
    Promise.all([
      con.execute(`DROP TABLE revenue`),
      con.execute(`DROP TABLE expenses`),
      con.execute(`DROP TABLE personal_transfers`),
    ])
  );
};

export const revert = () => {
  return Promise.resolve();
};
