import getMysqlConnection from "fuegojs/utils/mysql";

const deleteMigrationRecord = (uuid: string) => {
  return getMysqlConnection()
    .then((con) =>
      con
        .execute(`DELETE FROM _migrations WHERE uuid = ?`, [uuid])
        .then(() => con.destroy())
    )
    .then(() => ({ success: true }));
};

export default deleteMigrationRecord;
