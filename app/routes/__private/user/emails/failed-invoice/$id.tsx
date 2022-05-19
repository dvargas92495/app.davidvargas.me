import {
  Link,
  Outlet,
  useLoaderData,
  useNavigate,
  useParams,
} from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import remixAppLoader from "~/package/backend/remixAppLoader.server";
import { remixAdapter } from "~/data/getFailedInvoiceData.server";
import FailedInvoice from "~/emails/FailedInvoice";
export { default as ErrorBoundary } from "~/package/components/DefaultErrorBoundary";
export { default as CatchBoundary } from "~/package/components/DefaultCatchBoundary";

const FailedInvoiceEventPage = () => {
  const props = useLoaderData<Awaited<ReturnType<typeof remixAdapter>>>();
  const params = useParams();
  return <FailedInvoice {...props} id={params["id"] || ""} />;
};

export const loader: LoaderFunction = (args) =>
  remixAppLoader(args, remixAdapter);

export default FailedInvoiceEventPage;
