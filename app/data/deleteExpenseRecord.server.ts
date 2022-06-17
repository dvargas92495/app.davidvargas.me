import getMysqlConnection from "~/package/backend/mysql.server";

const deleteExpenseRecord = ({
  data: {
    uuid: [uuid],
  },
}: {
  data: Record<string, string[]>;
}) => {
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
