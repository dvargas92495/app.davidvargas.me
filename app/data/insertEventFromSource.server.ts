import getMysqlConnection from "~/package/backend/mysql.server";
import { v4 } from "uuid";
import { z } from "zod";

const dataSchema = z.object({
  amount: z.array(z.string()),
  description: z.array(z.string()),
  date: z.array(z.string()),
  code: z.array(z.string()),
  source: z.string(),
  id: z.string(),
});

const insertEventFromSource = async ({
  data: _data,
  params,
}: {
  data: Record<string, string[]>;
  params: Record<string, string | undefined>;
}) => {
  const data = dataSchema.parse({ ..._data, ...params });
  const {
    amount: [amount],
    description: [description],
    date: [date],
    code: [code],
    source,
    id: sourceId,
  } = data;
  return getMysqlConnection()
    .then((connection) => {
      return connection
        .execute(
          `INSERT INTO events (uuid, source, source_id, date, amount, description, code) 
     VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE amount=VALUES(amount)+amount`,
          [
            v4(),
            source,
            sourceId,
            new Date(date),
            Number(amount),
            description,
            Number(code),
          ]
        )
        .then(() => connection.destroy());
    })
    .then(() => ({ success: true }));
};

export default insertEventFromSource;
