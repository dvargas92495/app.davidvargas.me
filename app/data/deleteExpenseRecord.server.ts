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
      con
        .execute(`DELETE FROM expenses WHERE uuid = ?`, [uuid])
        .then(() => con.destroy())
    )
    .then(() => ({ success: true }))
    .catch((e) => {
      throw new Response(e.message, { status: 500 });
    });
};

export default deleteExpenseRecord;
