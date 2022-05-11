import getMysqlConnection from "~/package/backend/mysql.server";

const deleteRevenueRecord = (uuid: string) => {
  return getMysqlConnection()
    .then((con) =>
      con
        .execute(`DELETE FROM revenue WHERE uuid = ?`, [uuid])
        .then(() => con.destroy())
    )
    .then(() => ({ success: true }));
};

export default deleteRevenueRecord;
