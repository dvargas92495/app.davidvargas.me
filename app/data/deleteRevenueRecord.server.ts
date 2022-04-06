import getMysqlConnection from "@dvargas92495/api/mysql";

const deleteRevenueRecord = (uuid: string) => {
  console.log(`DELETE FROM revenue WHERE uuid =`, uuid);
  return getMysqlConnection()
    .then((con) =>
      con
        .execute(`DELETE FROM revenue WHERE uuid = ?`, [uuid])
        .then(() => con.destroy())
    )
    .then(() => ({ success: true }));
}

export default deleteRevenueRecord;
