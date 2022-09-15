import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import remixAppLoader from "~/package/backend/remixAppLoader.server";
import remixAppAction from "~/package/backend/remixAppAction.server";
import Table from "dist/app/package/components/Table";
import listWeeklyReports from "~/data/listWeeklyReports.server";
import generateWeeklyReport from "~/data/generateWeeklyReport.server";
import deleteReportRecord from "~/data/deleteReportRecord.server";
import Button from "~/package/components/Button";
import { Form, useSubmit } from "@remix-run/react";
export { default as ErrorBoundary } from "~/package/components/DefaultErrorBoundary";
export { default as CatchBoundary } from "~/package/components/DefaultCatchBoundary";

// NEXT STEPS:
// - Start filling out snapshot values From sheet
// - Add in Derived columns
// - Editable cells
// - Move delete to action button
const ReportsWeeklyPage = () => {
  const submit = useSubmit();
  return (
    <>
      <Form method="post" className="mb-4">
        <Button>+ New</Button>
      </Form>
      <Table
        onRowClick={(row) => submit({ uuid: row.uuid }, { method: "delete" })}
      />
    </>
  );
};

export const loader: LoaderFunction = (args) => {
  return remixAppLoader(args, listWeeklyReports);
};

export const action: ActionFunction = (args) => {
  return remixAppAction(args, {
    POST: generateWeeklyReport,
    DELETE: ({ data }) => deleteReportRecord(data["uuid"][0]),
  });
};

export default ReportsWeeklyPage;
