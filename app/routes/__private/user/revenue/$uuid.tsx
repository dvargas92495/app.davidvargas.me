import DefaultCatchBoundary from "~/package/components/DefaultCatchBoundary";
import DefaultErrorBoundary from "~/package/components/DefaultErrorBoundary";
import type { LoaderFunction } from "@remix-run/node";
import remixAppLoader from "~/package/backend/remixAppLoader.server";
import getRevenue from "~/data/getRevenue.server";
import { useLoaderData } from "@remix-run/react";

const RevenueRecord = () => {
  const data = useLoaderData<Awaited<ReturnType<typeof getRevenue>>>();
  return (
    <div>
      <h1 className="font-bold text-xl mb-2">{data.product}</h1>
      <p className="text-md italic font-normal mb-4">{data.date}</p>
      <h2 className="font-semibold text-lg">{data.source}</h2>
    </div>
  );
};

export const loader: LoaderFunction = (args) => {
  return remixAppLoader(args, ({ params }) => getRevenue(params["uuid"] || ""));
};

export const ErrorBoundary = DefaultErrorBoundary;
export const CatchBoundary = DefaultCatchBoundary;

export default RevenueRecord;
