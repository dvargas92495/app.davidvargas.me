import getMysqlConnection from "~/package/backend/mysql.server";

const getRevenue = (uuid: string) =>
  getMysqlConnection()
    .then((con) =>
      con.execute(`SELECT * FROM expense WHERE uuid = ?`, [uuid]).then((a) => {
        con.destroy();
        return a;
      })
    )
    .then((a) => {
      const record = (a as {}[])[0];
      return record;
    });

export default getRevenue;
