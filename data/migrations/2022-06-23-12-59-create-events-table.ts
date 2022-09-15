import getMysqlConnection from "~/package/backend/mysql.server";
import type { MigrationProps } from "fuegojs/types";
import type mysql from "mysql2";

export const migrate = ({ connection }: MigrationProps) => {
  return getMysqlConnection(connection).then((connection) =>
    connection
      .execute(
        `CREATE TABLE IF NOT EXISTS events (
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
      .then(() =>
        Promise.all([
          connection
            .execute(
              `INSERT INTO events(uuid, source, source_id, date, amount, description, code)
          SELECT uuid, source, source_id, date, amount, product, 4300
          FROM revenue ON DUPLICATE KEY UPDATE amount = VALUES(amount)`
            )
            .then((r) =>
              console.log(
                "migrated",
                (r as mysql.OkPacket).affectedRows,
                "revenue records"
              )
            ),
          connection
            .execute(
              `INSERT INTO events(uuid, source, source_id, date, amount, description, code)
          SELECT uuid, source, source_id, date, amount, description, code
          FROM expenses ON DUPLICATE KEY UPDATE amount = VALUES(amount)`
            )
            .then((r) =>
              console.log(
                "migrated",
                (r as mysql.OkPacket).affectedRows,
                "expense records"
              )
            ),
          connection
            .execute(
              `INSERT INTO events(uuid, source, source_id, date, amount, description, code)
          SELECT uuid, source, source_id, date, amount, description, code
          FROM personal_transfers ON DUPLICATE KEY UPDATE amount = VALUES(amount)`
            )
            .then((r) =>
              console.log(
                "migrated",
                (r as mysql.OkPacket).affectedRows,
                "transfer records"
              )
            ),
        ])
      )
  );
};

export const revert = ({ connection }: MigrationProps) => {
  return getMysqlConnection(connection).then((connection) =>
    connection.execute(`DROP TABLE IF EXISTS events`)
  );
};
