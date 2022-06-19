import getMysqlConnection from "~/package/backend/mysql.server";
import type { MigrationProps } from "fuegojs/dist/migrate";

export const migrate = ({ connection }: MigrationProps) => {
  return getMysqlConnection(connection).then((connection) =>
    connection.execute(
      `DROP TABLE etherscan`
    )
  );
};

export const revert = () => {
  return Promise.resolve();
};
