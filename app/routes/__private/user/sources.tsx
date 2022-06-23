import remixAppLoader from "~/package/backend/remixAppLoader.server";
import { Outlet, useNavigate } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import Table from "~/package/components/Table";
import DefaultErrorBoundary from "~/package/components/DefaultErrorBoundary";
import remixAppAction from "~/package/backend/remixAppAction.server";
import insertRecordFromEthereum from "~/data/insertRecordFromEthereum.server";
import listSourceTransactions from "~/data/listSourceTransactions.server";
import DefaultCatchBoundary from "~/package/components/DefaultCatchBoundary";

const UserMercury = () => {
  const navigate = useNavigate();
  return (
    <div className="flex gap-8">
      <Table
        onRowClick={(row) => navigate(`${row.source}/${row.id}`)}
        className={"max-w-4xl"}
      />
      <div className={"flex-grow"}>
        <Outlet />
      </div>
    </div>
  );
};

export const loader: LoaderFunction = (args) => {
  return remixAppLoader(args, listSourceTransactions);
};

export const action: ActionFunction = (args) => {
  return remixAppAction(args, ({ data, params }) =>
    insertRecordFromEthereum({ data, params }).catch((e) => {
      throw new Response(e.message, { status: 500 });
    })
  );
};

export const ErrorBoundary = DefaultErrorBoundary;
export const CatchBoundary = DefaultCatchBoundary;

export default UserMercury;
