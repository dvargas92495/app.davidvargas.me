import { useUser, UserButton } from "@clerk/remix";
import React from "react";
import Dashboard from "./Dashboard";

const UserFooter = () => {
  const user = useUser();
  return (
    <>
      <UserButton />
      <div className="ml-4">
        {user.user?.firstName} {user.user?.lastName}
      </div>
    </>
  );
};

const UserDashboard = ({
  tabs,
}: {
  tabs: Parameters<typeof Dashboard>[0]["tabs"];
}) => {
  return <Dashboard footer={<UserFooter />} root={"user"} tabs={tabs} />;
};

export default UserDashboard;
