import getMysqlConnection from "~/package/backend/mysql.server";

const listMonthlyReports = async ({
  context: { requestId },
}: {
  context: { requestId: string };
}) => {
    const cxn = await getMysqlConnection(requestId);
    // TODO WHERE DIFF of dates > 27 days < 32 days
    const results = await cxn.execute(`SELECT * FROM reports`)
};

export default listMonthlyReports;
