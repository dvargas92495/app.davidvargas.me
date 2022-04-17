import getMysqlConnection from "@dvargas92495/api/mysql";
import type { MigrationProps } from "fuegojs/dist/migrate";

export const migrate = ({ connection }: MigrationProps) => {
  return getMysqlConnection(connection).then((connection) =>
    connection.execute(`ALTER TABLE expenses ADD COLUMN code INT NOT NULL`)
  );
};

export const revert = ({ connection }: MigrationProps) => {
  return Promise.resolve()/*getMysqlConnection(connection).then((connection) =>
    connection.execute(`ALTER TABLE expenses DROP COLUMN code`)
  );*/
};
