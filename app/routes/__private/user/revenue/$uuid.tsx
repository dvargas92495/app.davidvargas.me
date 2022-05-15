import DefaultCatchBoundary from "~/package/components/DefaultCatchBoundary";
import DefaultErrorBoundary from "~/package/components/DefaultErrorBoundary";
import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import remixAppLoader from "~/package/backend/remixAppLoader.server";
import getRevenue from "~/data/getRevenue.server";
import { Form, useLoaderData } from "@remix-run/react";
import remixAppAction from "~/package/backend/remixAppAction.server";
import deleteRevenueRecord from "~/data/deleteRevenueRecord.server";
import Button from "~/package/components/Button";

const RevenueRecord = () => {
  const data = useLoaderData<Awaited<ReturnType<typeof getRevenue>>>();
  return (
    <div>
      <h1 className="font-bold text-xl mb-2">{data.product}</h1>
      <p className="text-md italic font-normal mb-4">{data.date}</p>
      <h2 className="font-semibold text-lg">{data.source}</h2>
      <Form method="delete">
        <Button>Delete</Button>
      </Form>
    </div>
  );
};

export const loader: LoaderFunction = (args) => {
  return remixAppLoader(args, ({ params }) => getRevenue(params["uuid"] || ""));
};

export const action: ActionFunction = (args) => {
  return remixAppAction(args, ({ params, method, searchParams }) => {
    if (method === "DELETE")
      deleteRevenueRecord(params["uuid"] || "").then(() => {
        return redirect(
          `/user/revenue${
            Object.keys(searchParams).length
              ? ""
              : `?${new URLSearchParams(searchParams).toString()}`
          }&used=${args.request.bodyUsed}&body=${args.request.body}`
        );
      });
    else throw new Response(`Method ${method} not found`, { status: 404 });
  });
};

export const ErrorBoundary = DefaultErrorBoundary;
export const CatchBoundary = DefaultCatchBoundary;

export default RevenueRecord;
