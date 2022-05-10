import React from "react";
import getMeta from "~/package/utils/getMeta";
import UserDashboard from "~/package/components/UserDashboard";

const TABS = [
  "Expenses",
  "Revenue",
  "Transfers",
  "Convertkit",
  "Etherscan",
  "Mercury",
  "Mysql",
  "Stripe",
  "Terraform",
];

const UserPage: React.FunctionComponent = () => {
  return <UserDashboard tabs={TABS} />;
};

export const meta = getMeta({
  title: "User",
});

export default UserPage;
