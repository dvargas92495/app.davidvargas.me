import React from "react";
import getMeta from "~/package/utils/getMeta";
import UserDashboard from "~/package/components/UserDashboard";
export { default as ErrorBoundary } from "~/package/components/DefaultErrorBoundary";
export { default as CatchBoundary } from "~/package/components/DefaultCatchBoundary";

const TABS = [
  "Sources",
  "Events",
  "Rules",
  "Emails",
  ///DEPRECATED///
  "Mysql",
  "Terraform",
  "Ethereum",
];

const UserPage: React.FunctionComponent = () => {
  return <UserDashboard tabs={TABS} />;
};

export const meta = getMeta({
  title: "User",
});

export default UserPage;
