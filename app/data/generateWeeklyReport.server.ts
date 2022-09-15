import axios from "axios";
import { v4 } from "uuid";
import { z } from "zod";
import getMysqlConnection from "~/package/backend/mysql.server";
import listSources from "./listSources.server";

const generateWeeklyReport = ({
  context: { requestId },
  userId,
}: {
  userId: string;
  context: { requestId: string };
}) =>
  listSources()
    .then((sources) =>
      Promise.all(
        sources.map((s) =>
          axios.get(s.snapshot).then((r) => {
            const { amount } = z.object({ amount: z.number() }).parse(r.data);
            return {
              id: s.label.toLowerCase().replace(/ /g, "-"),
              amount,
            };
          })
        )
      )
    )
    .then(async (records) => {
      const uuid = v4();
      const cxn = await getMysqlConnection(requestId);
      const today = new Date();
      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7);
      await cxn.execute(
        `INSERT INTO reports (uuid, user_id, start, end) VALUES (?,?,?,?)`,
        [uuid, userId, lastWeek, today]
      );
      await cxn.execute(
        `INSERT INTO report_sources (uuid, source, snapshot, report_uuid) VALUES ${records
          .map(() => `(UUID(),?,?,?)`)
          .join(",")}`,
        records.flatMap((r) => [r.id, r.amount, uuid])
      );
      cxn.destroy();
      return { success: true };
    });

export default generateWeeklyReport;
