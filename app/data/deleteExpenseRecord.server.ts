import getMysqlConnection from "~/package/backend/mysql.server";
import { z } from "zod";

const schema = z.object({ uuid: z.string() });

const deleteExpenseRecord = ({
  params,
}: {
  params: Record<string, string | undefined>;
}) => {
  const { uuid } = schema.parse(params);
  return getMysqlConnection()
    .then((con) =>
      con.execute(`DELETE FROM expenses WHERE uuid = ?`, [uuid]).then((r) => {
        con.destroy();
        return r;
      })
    )
    .then((result) => ({ success: true, result }));
};

export default deleteExpenseRecord;
