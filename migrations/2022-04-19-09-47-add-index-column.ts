import getMysqlConnection from "~/package/backend/mysql.server";
import type { MigrationProps } from "fuegojs/dist/migrate";

export const migrate = ({ connection }: MigrationProps) => {
  return getMysqlConnection(connection).then((connection) =>
    connection.execute(
      `ALTER TABLE etherscan ADD COLUMN tx_index INT NOT NULL DEFAULT -1`
    )
  );
};

export const revert = ({ connection }: MigrationProps) => {
  return getMysqlConnection(connection).then((connection) =>
    connection.execute(`ALTER TABLE etherscan DROP COLUMN tx_index`)
  );
};
