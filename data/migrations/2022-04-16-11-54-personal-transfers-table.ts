import getMysqlConnection from "fuegojs/utils/mysql";
import type { MigrationProps } from "fuegojs/types";

export const migrate = ({ connection }: MigrationProps) => {
  return getMysqlConnection(connection).then((connection) =>
    connection.execute(
      `CREATE TABLE IF NOT EXISTS personal_transfers (
          uuid        VARCHAR(36)  NOT NULL,
          source      VARCHAR(191) NOT NULL,
          source_id   VARCHAR(191) NOT NULL,
          date        DATETIME(3)  NOT NULL,
          amount      INT          NOT NULL,
          description VARCHAR(191) NOT NULL,
          code        INT          NOT NULL,
  
          PRIMARY KEY (uuid),
          CONSTRAINT UC_source UNIQUE (source,source_id)
        )`
    )
  );
};

export const revert = ({ connection }: MigrationProps) => {
  return getMysqlConnection(connection).then((connection) =>
    connection.execute(`DROP TABLE IF EXISTS personal_transfers`)
  );
};
