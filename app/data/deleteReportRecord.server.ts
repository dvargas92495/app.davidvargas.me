import getMysqlConnection from "fuegojs/utils/mysql";

const deleteReportRecord = (uuid: string) => {
  return getMysqlConnection()
    .then(async (con) => {
      await Promise.all([
        con.execute(`DELETE FROM report_sources WHERE report_uuid = ?`, [uuid]),
        con.execute(`DELETE FROM report_events WHERE report_uuid = ?`, [uuid]),
      ]);
      return con
        .execute(`DELETE FROM reports WHERE uuid = ?`, [uuid])
        .then(() => con.destroy());
    })
    .then(() => ({ success: true }));
};

export default deleteReportRecord;
