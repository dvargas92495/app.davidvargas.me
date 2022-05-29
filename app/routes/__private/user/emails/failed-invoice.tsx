import {
  Link,
  Outlet,
  useLoaderData,
  useNavigate,
  useParams,
} from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import remixAppLoader from "~/package/backend/remixAppLoader.server";
import listFailedInvoiceEvents from "~/data/listFailedInvoiceEvents.server";
import Select from "~/package/components/Select";
export { default as ErrorBoundary } from "~/package/components/DefaultErrorBoundary";
export { default as CatchBoundary } from "~/package/components/DefaultCatchBoundary";

const FailedInvoicePage = () => {
  const { events } =
    useLoaderData<Awaited<ReturnType<typeof listFailedInvoiceEvents>>>();
  const navigate = useNavigate();
  const params = useParams();
  return (
    <div className="flex flex-col h-full">
      <div className="max-w-sm">
        <Select
          label="Event"
          options={events}
          onChange={(s) => navigate(`${s}`)}
          defaultValue={params["id"]}
        />
      </div>
      <div className="h-full max-w-xl border border-black flex-grow">
        <Outlet />
      </div>
    </div>
  );
};

export const loader: LoaderFunction = (args) =>
  remixAppLoader(args, listFailedInvoiceEvents);

export default FailedInvoicePage;
