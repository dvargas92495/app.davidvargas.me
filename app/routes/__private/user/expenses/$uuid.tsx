import DefaultCatchBoundary from "~/package/components/DefaultCatchBoundary";
import DefaultErrorBoundary from "~/package/components/DefaultErrorBoundary";
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import remixAppLoader from "~/package/backend/remixAppLoader.server";
import getExpense from "~/data/getExpense.server";
import { Form, useLoaderData } from "@remix-run/react";
import remixAppAction from "~/package/backend/remixAppAction.server";
import Button from "~/package/components/Button";

const RevenueRecord = () => {
  const data = useLoaderData<Awaited<ReturnType<typeof getExpense>>>();
  return (
    <div>
      <pre>{JSON.stringify(data, null, 4)}</pre>
      {/* <h1 className="font-bold text-xl mb-2">{data.product}</h1>
      <p className="text-md italic font-normal mb-4">{data.date}</p>
      <h2 className="font-semibold text-lg">{data.source}</h2> */}
      <Form method="delete">
        <Button>Delete</Button>
      </Form>
    </div>
  );
};

export const loader: LoaderFunction = (args) => {
  return remixAppLoader(args, ({ params }) => getExpense(params["uuid"] || ""));
};

export const action: ActionFunction = (args) => {
  return remixAppAction(args);
};

export const ErrorBoundary = DefaultErrorBoundary;
export const CatchBoundary = DefaultCatchBoundary;

export default RevenueRecord;
