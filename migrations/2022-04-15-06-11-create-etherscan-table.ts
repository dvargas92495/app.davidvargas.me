import getMysqlConnection from "~/package/backend/mysql.server";
import type { MigrationProps } from "fuegojs/dist/migrate";

export const migrate = ({ connection }: MigrationProps): Promise<void> => {
  return getMysqlConnection(connection)
    .then((connection) =>
      connection.execute(
        `CREATE TABLE IF NOT EXISTS etherscan (
              hash      VARCHAR(191) PRIMARY KEY,
              date      DATETIME(3)  NOT NULL,
              source    VARCHAR(191) NOT NULL,
              target    VARCHAR(191) NOT NULL,
              gas       VARCHAR(191) NOT NULL,
              method    VARCHAR(191) NOT NULL,
              value     VARCHAR(191) NOT NULL,
              user_id   VARCHAR(191) NOT NULL
            )`
      )
    )
    .then(() => console.log("cached"));
};

export const revert = ({ connection }: MigrationProps) => {
  return getMysqlConnection(connection).then((connection) =>
    connection.execute(`DROP TABLE IF EXISTS etherscan`)
  );
};
