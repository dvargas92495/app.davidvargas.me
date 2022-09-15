import type { LoaderFunction } from "@remix-run/node";
import remixAppLoader from "~/package/backend/remixAppLoader.server";
import { useLoaderData } from "@remix-run/react";
export { default as ErrorBoundary } from "~/package/components/DefaultErrorBoundary";
export { default as CatchBoundary } from "~/package/components/DefaultCatchBoundary";

const ReportsIndexPage = () => {
  return (
    <div>
      Unsure what to put here yet. Either Settings, net worth calcs, or both
    </div>
  );
};

export default ReportsIndexPage;
