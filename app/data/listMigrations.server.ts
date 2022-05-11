import getMysqlConnection from "~/package/backend/mysql.server";

const listRevenueFromStripe = () =>
  getMysqlConnection()
    .then((con) =>
      con.execute(`SELECT * FROM _migrations ORDER BY started_at`).then((a) => {
        con.destroy();
        return a;
      })
    )
    .then((a) => ({
      values: (
        a as {
          uuid: string;
          checksum: string;
          migration_name: string;
          started_at: Date;
          finished_at: Date | null;
        }[]
      ).map((record) => ({
        uuid: record.uuid,
        checksum: record.checksum,
        name: record.migration_name,
        start: record.started_at.valueOf(),
        end: record.finished_at ? record.finished_at.valueOf() : 0,
      })),
    }));

export default listRevenueFromStripe;
