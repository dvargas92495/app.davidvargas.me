import getMysqlConnection from "fuegojs/utils/mysql";
import type { MigrationProps } from "fuegojs/types";

export const migrate = ({ connection }: MigrationProps) => {
  return getMysqlConnection(connection).then((connection) =>
    connection.execute(`DROP TABLE etherscan`)
  );
};

export const revert = () => {
  return Promise.resolve();
};
