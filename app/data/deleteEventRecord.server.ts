import getMysqlConnection from "fuegojs/utils/mysql";

const deleteEventRecord = (uuid: string) => {
  return getMysqlConnection()
    .then((con) =>
      con
        .execute(`DELETE FROM events WHERE uuid = ?`, [uuid])
        .then(() => con.destroy())
    )
    .then(() => ({ success: true }));
};

export default deleteEventRecord;
