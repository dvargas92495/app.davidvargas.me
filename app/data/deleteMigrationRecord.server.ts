import getMysqlConnection from "@dvargas92495/api/mysql";

const deleteRevenueRecord = (uuid: string) => {
  return getMysqlConnection()
    .then((con) =>
      con
        .execute(`DELETE FROM _migrations WHERE uuid = ?`, [uuid])
        .then(() => con.destroy())
    )
    .then(() => ({ success: true }));
}

export default deleteRevenueRecord;
