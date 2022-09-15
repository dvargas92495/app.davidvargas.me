import getMysqlConnection from "fuegojs/utils/mysql";
import type { MigrationProps } from "fuegojs/types";

export const migrate = ({ connection }: MigrationProps) => {
  return getMysqlConnection(connection).then((connection) =>
    connection.execute(`ALTER TABLE expenses ADD COLUMN code INT NOT NULL`)
  );
};

export const revert = ({ connection }: MigrationProps) => {
  return getMysqlConnection(connection).then((connection) =>
    connection.execute(`ALTER TABLE expenses DROP COLUMN code`)
  );
};
