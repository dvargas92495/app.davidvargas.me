import React from "react";
import Dashboard from "~/package/components/Dashboard";

const DashboardPage = () => {
  return (
    <div className="-m-4 h-full">
      <Dashboard
        root={"/components/dashboard"}
        tabs={["Tab", "Page", "Settings"]}
        footer={<>Hello World!</>}
      />
    </div>
  );
};

export default DashboardPage;
