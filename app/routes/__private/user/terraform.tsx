export { default as CatchBoundary } from "~/package/components/DefaultCatchBoundary";
export { default as ErrorBoundary } from "~/package/components/DefaultErrorBoundary";
import { Link, Outlet, useMatches } from "@remix-run/react";
import React from "react";

const Tab = ({ children, to }: React.PropsWithChildren<{ to: string }>) => {
  const matches = useMatches();
  const current = matches[4]?.pathname || '';
  const root = matches[3].pathname;
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

const TerraformPage = () => {
  return (
    <div className="h-full flex flex-col pb-16">
      <div className="flex gap-4 items-center mb-4">
        <Tab to={""}>Home</Tab>
        <Tab to={"variables"}>Variables</Tab>
      </div>
      <div className="rounded-3xl shadow-lg p-8 flex-grow h-full max-w-xl bg-gray-100 flex flex-col">
        <Outlet />
      </div>
    </div>
  );
};

export default TerraformPage;
