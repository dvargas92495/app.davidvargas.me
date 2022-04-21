import React from "react";
import Table from "@dvargas92495/ui/components/Table";
import type { LoaderFunction } from "@remix-run/server-runtime";
import remixAppLoader from "@dvargas92495/ui/utils/remixAppLoader.server";
import searchTransfers from "~/data/searchTransfers.server";

const UserTransfersPage = () => {
  return <Table />;
};

export const loader: LoaderFunction = (args) => {
  return remixAppLoader(args, searchTransfers);
};

export default UserTransfersPage;
