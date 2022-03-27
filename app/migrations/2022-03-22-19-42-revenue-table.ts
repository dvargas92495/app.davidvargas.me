import type mysql from "mysql2";

export const migrate = ({
  connection,
}: {
  connection: mysql.Connection;
}): Promise<void> => {
  return new Promise((resolve) =>
    connection.execute(
      `CREATE TABLE IF NOT EXISTS revenue (
        uuid      VARCHAR(36)  NOT NULL,
        source    VARCHAR(191) NOT NULL,
        source_id VARCHAR(191) NOT NULL,
        date      DATETIME(3)  NOT NULL,
        amount    INT          NOT NULL,
        product   VARCHAR(64)  NOT NULL,
        connect   INT          NOT NULL

        PRIMARY KEY (uuid),
        CONSTRAINT UC_source UNIQUE (source,source_id)
    )`,
      resolve
    )
  );
};
