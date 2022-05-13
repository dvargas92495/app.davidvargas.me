import React, { useCallback } from "react";
import { Link, Outlet, useMatches } from "@remix-run/react";

const Dashboard = ({
  title = "App",
  root,
  tabs,
  footer,
}: {
  title?: string;
  root: string;
  tabs: { id: string; label: string }[] | string[];
  footer: React.ReactNode;
}) => {
  const TABS = tabs.map((s) =>
    typeof s === "string"
      ? {
          id: s
            .replace(/ /g, "-")
            .match(/(?:^|[A-Z])[a-z]+/g)
            ?.map((s) => s.toLowerCase())
            .join("-"),
          label: s,
        }
      : s
  );
  const labelByTab = Object.fromEntries(TABS.map((t) => [t.id, t.label]));
  const matches = useMatches();
  const activeTab = (
    matches.find((m) => new RegExp(`^\\/${root}\\/[a-z-]+$`).test(m.pathname))
      ?.pathname || ""
  ).replace(new RegExp(`^\\/${root}\\/$`), "");
  const DefaultPageTitle = useCallback(
    () => <>{labelByTab[activeTab] || "Dashboard"}</>,
    [labelByTab, activeTab]
  );
  const CurrentPageTitle =
    matches.reverse().find((m) => m.handle?.Title)?.handle?.Title ||
    DefaultPageTitle;
  return (
    <div className="min-h-full flex">
      <nav className="bg-sky-700 min-h-full w-60 flex flex-col text-gray-200 flex-shrink-0">
        <div className="p-4 flex items-center">
          <div className="mr-4">
            <img
              className="h-12 w-12"
              src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
              alt="Workflow"
            />
          </div>
          <h2 className="text-white text-2xl font-bold">{title}</h2>
        </div>
        <div className="flex-grow">
          {TABS.map((tab) => (
            <div key={tab.id} className="h-16 p-2">
              <Link to={`/${root}/${tab.id}`}>
                <div
                  className={`p-2 min-h-full flex items-center ${
                    activeTab === tab.id ? "bg-sky-900 rounded-md" : ""
                  } capitalize hover:bg-sky-800`}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-gray-200">
                    <path
                      d="M19 5h-2V3c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v2H9V3c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v2H1c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V6c0-.55-.45-1-1-1zM8.71 15.29a1.003 1.003 0 01-1.42 1.42l-4-4C3.11 12.53 3 12.28 3 12s.11-.53.29-.71l4-4a1.003 1.003 0 011.42 1.42L5.41 12l3.3 3.29zm8-2.58l-4 4a1.003 1.003 0 01-1.42-1.42l3.3-3.29-3.29-3.29A.965.965 0 0111 8a1.003 1.003 0 011.71-.71l4 4c.18.18.29.43.29.71s-.11.53-.29.71z"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                  <span className={"ml-2"}>{tab.id}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
        <div className="h-12 bg-sky-900 flex items-center px-4">{footer}</div>
      </nav>
      <div className="p-8 flex-grow flex flex-col">
        <h1 className="capitalize text-2xl font-bold mb-4">
          <CurrentPageTitle />
        </h1>
        <div className="flex-grow">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
