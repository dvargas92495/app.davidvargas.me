import getMysqlConnection from "fuegojs/utils/mysql";

const format = (n: number) => n.toString().padStart(2, "0");

const formatDate = (d: Date) =>
  `${d.getFullYear()}/${format(d.getMonth() + 1)}/${format(d.getDate())}`;

const listWeeklyReports = async ({
  context: { requestId },
  userId,
}: {
  userId: string;
  context: { requestId: string };
}) => {
  const cxn = await getMysqlConnection(requestId);
  // TODO WHERE DIFF of dates > 6 days < 8 days
  const [results] = await cxn.execute(
    `SELECT r.uuid, r.start, r.end, s.source, s.snapshot 
      FROM reports r
      INNER JOIN report_sources s ON s.report_uuid = r.uuid
      WHERE r.user_id = ? AND DATEDIFF(r.end, r.start) = 7`,
    [userId]
  );
  const reports = (
    results as {
      start: Date;
      end: Date;
      source: string;
      uuid: string;
      snapshot: number;
    }[]
  ).reduce((p, c) => {
    if (p[c.uuid]) {
      p[c.uuid].sources.push([c.source, c.snapshot]);
    } else {
      p[c.uuid] = {
        start: c.start,
        end: c.end,
        sources: [[c.source, c.snapshot]],
      };
    }
    return p;
  }, {} as Record<string, { sources: [string, number][]; start: Date; end: Date }>);
  return {
    data: Object.entries(reports)
      .sort((a, b) => b[1].end.valueOf() - a[1].end.valueOf())
      .map(([uuid, r]) => ({
        uuid,
        date: `${formatDate(r.start)} - ${formatDate(r.end)}`,
        ...Object.fromEntries(
          r.sources.map((e) => [e[0], `$${(e[1] / 100).toFixed(2)}`])
        ),
      })),
    columns: Object.keys(reports).length
      ? [{ Header: "date", accessor: "date" }].concat(
          Object.values(reports)[0].sources.map((s) => ({
            Header: s[0],
            accessor: s[0],
          }))
        )
      : [],
  };
};

export default listWeeklyReports;
