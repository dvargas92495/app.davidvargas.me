import remixAppLoader from "@dvargas92495/ui/utils/remixAppLoader.server";
import { ActionFunction, LoaderFunction, useCatch } from "remix";
import { CatchBoundaryComponent } from "@remix-run/server-runtime/routeModules";
import Table from "~/components/Table";
import React from "react";
import DefaultErrorBoundary from "~/components/DefaultErrorBoundary";
import listEtherscanRecords from "~/data/listEtherscanRecords.server";

const UserEtherscan = () => {
  return (
    <>
      <Table />
    </>
  );
};

export const loader: LoaderFunction = (args) => {
  return remixAppLoader(args, ({ userId }) => listEtherscanRecords(userId));
};

export const action: ActionFunction = () => {};

export const ErrorBoundary = DefaultErrorBoundary;
export const CatchBoundary: CatchBoundaryComponent = () => {
  const caught = useCatch();
  return (
    <DefaultErrorBoundary
      error={
        new Error(
          typeof caught.data === "object"
            ? JSON.stringify(caught.data)
            : caught.data
        )
      }
    />
  );
};

export default UserEtherscan;
