import { Link, Outlet, useMatches } from "@remix-run/react";
export { default as ErrorBoundary } from "~/package/components/DefaultErrorBoundary";
export { default as CatchBoundary } from "~/package/components/DefaultCatchBoundary";

const Tab = ({ children, to }: React.PropsWithChildren<{ to: string }>) => {
  const matches = useMatches();
  const current = matches[4]?.pathname;
  const root = matches[3]?.pathname;
  const active = `${root}/${to}` === current;
  return (
    <Link
      to={to}
      className={`rounded-lg border border-sky-600 text-sky-600 hover:bg-sky-100 cursor-pointer active:bg-sky-200 py-2 px-4 ${
        active ? "bg-sky-200" : "bg-none"
      }`}
    >
      {children}
    </Link>
  );
};

const EmailsPage = () => {
  return (
    <div className="h-full flex flex-col pb-16">
      <div className="flex gap-4 items-center mb-4">
        <Tab to={"failed-invoice"}>Failed Invoice</Tab>
      </div>
      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
};

export const handle = {
  Title: "Emails",
}

export default EmailsPage;
