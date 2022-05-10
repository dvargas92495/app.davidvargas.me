import React from "react";
import Table from "~/package/components/Table";
import type { LoaderFunction } from "@remix-run/server-runtime";
import remixAppLoader from "~/package/backend/remixAppLoader.server";
import searchRevenue from "~/data/searchRevenue.server";

const UserRevenuePage = () => {
  return <Table />;
};

export const loader: LoaderFunction = (args) => {
  return remixAppLoader(args, searchRevenue);
};

export default UserRevenuePage;
