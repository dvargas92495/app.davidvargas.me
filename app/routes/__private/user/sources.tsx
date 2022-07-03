import remixAppLoader from "~/package/backend/remixAppLoader.server";
import { Outlet, useNavigate, useSearchParams } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import Table from "~/package/components/Table";
import DefaultErrorBoundary from "~/package/components/DefaultErrorBoundary";
import remixAppAction from "~/package/backend/remixAppAction.server";
import insertRecordFromEthereum from "~/data/insertRecordFromEthereum.server";
import listSourceTransactions from "~/data/listSourceTransactions.server";
import DefaultCatchBoundary from "~/package/components/DefaultCatchBoundary";

const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24;

const UserMercury = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const dateParam = searchParams.get("date");
  const date = dateParam ? new Date(dateParam) : new Date();
  return (
    <div className="flex gap-8">
      <Table
        onRowClick={(row) =>
          navigate(
            `${row.source}/${row.id}${
              searchParams.toString() && `?${searchParams.toString()}`
            }`
          )
        }
        className={"max-w-4xl"}
      />
      <div className={"flex-grow"}>
        <div className="flex items-center gap-4">
          <button
            className="bg-orange-500 font-bold cursor-pointer rounded-full h-8 w-8"
            onClick={() =>
              setSearchParams({
                date: new Date(
                  date.valueOf() - 30 * MILLISECONDS_IN_DAY
                ).toJSON(),
              })
            }
          >
            {"<"}
          </button>
          <span>{searchParams.get("date") || "Today"}</span>
          <button
            className="bg-orange-500 font-bold cursor-pointer rounded-full h-8 w-8 disabled:bg-opacity-50 disabled:cursor-not-allowed"
            disabled={
              new Date().valueOf() - date.valueOf() < 30 * MILLISECONDS_IN_DAY
            }
            onClick={() =>
              setSearchParams({
                date: new Date(
                  date.valueOf() + 30 * MILLISECONDS_IN_DAY
                ).toJSON(),
              })
            }
          >
            {">"}
          </button>
        </div>
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
