import getMysqlConnection from "@dvargas92495/api/mysql";

const deleteExpenseRecord = ({
  userId,
  searchParams: { uuid },
}: {
  userId: string;
  searchParams: Record<string, string>;
}) => {
  return getMysqlConnection()
    .then((con) =>
      con
        .execute(`SELECT source, source_id FROM expenses WHERE uuid = ?`, [
          uuid,
        ])
        .then((a):Promise<unknown> => {
          const [record] = a as { source: string; source_id: string }[];
          if (record.source === "etherscan")
            return con.execute(
              `DELETE FROM etherscan WHERE user_id = ? AND hash = ?`,
              [userId, record.source_id]
            );
          return Promise.resolve();
        })
        .then(() => con.execute(`DELETE FROM expenses WHERE uuid = ?`, [uuid]))
        .then(() => con.destroy())
    )
    .then(() => ({ success: true }));
};

export default deleteExpenseRecord;
