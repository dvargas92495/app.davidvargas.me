import type { LoaderFunction } from "@remix-run/node";
import remixAppLoader from "~/package/backend/remixAppLoader.server";
import { Outlet } from "@remix-run/react";
import TabLink from "~/package/components/TabLink";
export { default as ErrorBoundary } from "~/package/components/DefaultErrorBoundary";
export { default as CatchBoundary } from "~/package/components/DefaultCatchBoundary";

const Tabs = ["Home", "Weekly", "Monthly"];

const UserReportsPage = () => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-4">
        {Tabs.map((t) => (
          <TabLink to={t === "Home" ? "" : t.toLowerCase()} base={4}>
            {t}
          </TabLink>
        ))}
      </div>
      <div className="relative flex-grow p-4">
        <Outlet />
      </div>
    </div>
  );
};

export const loader: LoaderFunction = (args) => {
  return remixAppLoader(args, () => {
    // TODO get Present day accounting of all accounts
    // OR Report configuration
    return {};
  });
};

export default UserReportsPage;
