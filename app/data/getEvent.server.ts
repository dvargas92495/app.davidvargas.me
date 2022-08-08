import getMysqlConnection from "~/package/backend/mysql.server";
import { NotFoundError } from "~/package/backend/errors.server";

const getEvent = (uuid: string) =>
  getMysqlConnection()
    .then((con) =>
      con.execute(`SELECT * FROM events WHERE uuid = ?`, [uuid]).then((a) => {
        con.destroy();
        return a;
      })
    )
    .then(([a]) => {
      const record = (
        a as {
          uuid: string;
          source: string;
          source_id: string;
          date: Date;
          amount: number;
          description: string;
          code: number;
        }[]
      )[0];
      if (!record)
        throw new NotFoundError(`Could not find event record: ${uuid}`);
      return {
        source: record.source,
        source_id: record.source_id,
        date: record.date.toLocaleString(),
        description: record.description,
      };
    });

export default getEvent;
