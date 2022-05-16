import React from "react";
import Dashboard from "~/package/components/Dashboard";

const DashboardPage = () => {
  return (
    <div className="absolute inset-0">
      <Dashboard
        root={"components/dashboard"}
        tabs={["Tab", "Page", "Settings"]}
        footer={<>Hello World!</>}
      />
    </div>
  );
};

export default DashboardPage;
