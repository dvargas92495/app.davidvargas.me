import getMysqlConnection from "~/package/backend/mysql.server";
import { NotFoundError } from "aws-sdk-plus/dist/errors";

const getRevenue = (uuid: string) =>
  getMysqlConnection()
    .then((con) =>
      con.execute(`SELECT * FROM revenue WHERE uuid = ?`, [uuid]).then((a) => {
        con.destroy();
        return a;
      })
    )
    .then((a) => {
      const record = (
        a as {
          uuid: string;
          source: string;
          source_id: string;
          date: Date;
          amount: number;
          product: string;
          connect: number;
        }[]
      )[0];
      if (!record)
        throw new NotFoundError(`Could not find Revenue record: ${uuid}`);
      return {
        source: record.source,
        source_id: record.source_id,
        date: record.date.toLocaleString(),
        product: record.product,
      };
    });

export default getRevenue;
