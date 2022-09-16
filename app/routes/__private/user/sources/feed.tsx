import remixAppLoader from "~/package/backend/remixAppLoader.server";
import {
  Form,
  Outlet,
  useMatches,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import Table from "~/package/components/Table";
export { default as ErrorBoundary } from "~/package/components/DefaultErrorBoundary";
import remixAppAction from "~/package/backend/remixAppAction.server";
import insertEventFromSource from "~/data/insertEventFromSource.server";
import listSourceTransactions from "~/data/listSourceTransactions.server";
export { default as CatchBoundary } from "~/package/components/DefaultCatchBoundary";
import Button from "~/package/components/Button";
import getSourceTransaction from "~/data/getSourceTransaction.server";
import SuccessfulActionToast from "~/package/components/SuccessfulActionToast";

const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24;
const INTERVAL = 7;

const SourcesFeedPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const dateParam = searchParams.get("date");
  const search = `${searchParams.toString() && `?${searchParams.toString()}`}`;
  const date = dateParam ? new Date(dateParam) : new Date();
  const matches = useMatches();
  const leaf = matches[matches.length - 1].params?.id;
  return (
    <div className="flex gap-8">
      <Table
        onRowClick={(row) => navigate(`${row.source}/${row.id}${search}`)}
        className={"max-w-4xl"}
        activeRow={leaf}
      />
      <div className={"flex-grow"}>
        <div className="flex items-center gap-4 mb-4">
          <button
            className="bg-orange-500 font-bold cursor-pointer rounded-full h-8 w-8"
            onClick={() =>
              setSearchParams({
                date: new Date(
                  date.valueOf() - INTERVAL * MILLISECONDS_IN_DAY
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
              new Date().valueOf() - date.valueOf() <
              INTERVAL * MILLISECONDS_IN_DAY
            }
            onClick={() =>
              setSearchParams({
                date: new Date(
                  date.valueOf() + INTERVAL * MILLISECONDS_IN_DAY
                ).toJSON(),
              })
            }
          >
            {">"}
          </button>
          <Form method="put" action={`/user/sources${search}`}>
            <Button>Bulk Save</Button>
          </Form>
        </div>
        <Outlet />
      </div>
      <SuccessfulActionToast />
    </div>
  );
};

export const loader: LoaderFunction = (args) => {
  return remixAppLoader(args, listSourceTransactions);
};

export const action: ActionFunction = (args) => {
  return remixAppAction(args, {
    PUT: ({ searchParams, userId }) =>
      listSourceTransactions({ userId, searchParams })
        .then(({ data }) =>
          data.map(
            (d) => () =>
              getSourceTransaction({
                userId,
                params: { id: d.id, source: d.source },
              })
                .then((tx) =>
                  tx.found
                    ? insertEventFromSource({
                        params: { id: d.id, source: d.source },
                        data: {
                          amount: [tx.amount.toString()],
                          description: [tx.description],
                          date: [tx.date],
                          code: [tx.code.toString()],
                        },
                      }).then(() => 1)
                    : 0
                )
                .catch(() => 0)
          )
        )
        .then((promises) =>
          promises
            .reduce(
              (p, c) => p.then((t) => c().then((r) => r + t)),
              Promise.resolve(0)
            )
            .then((saved) => ({
              total: promises.length,
              saved,
            }))
        )
        .then((result) => ({
          success: true,
          message: `Successfully saved ${result.saved} defined events from ${result.total} sources.`,
        })),
  });
};

export default SourcesFeedPage;
