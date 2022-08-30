import { useUser, UserButton } from "@clerk/remix";
import { Link, useLoaderData } from "@remix-run/react";
import Dashboard from "./Dashboard";

const UserFooter = () => {
  const user = useUser();
  return (
    <>
      <UserButton />
      <div className="ml-4">
        {user.user?.firstName || "Anonymous"} {user.user?.lastName}
      </div>
    </>
  );
};

const UserDashboard = ({
  title,
  tabs,
}: {
  title?: string;
  tabs: Parameters<typeof Dashboard>[0]["tabs"];
}) => {
  const { isAdmin } = useLoaderData<{ isAdmin: boolean }>() || {};
  return (
    <Dashboard
      footer={
        <>
          <UserFooter />
          {isAdmin && <Link to={"/admin"} />}
        </>
      }
      root={"user"}
      tabs={tabs}
      title={title}
    />
  );
};

export default UserDashboard;
