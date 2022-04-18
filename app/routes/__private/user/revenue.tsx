import React from "react";
import Table from "~/components/Table";
import {LoaderFunction} from "remix";
import remixAppLoader from "@dvargas92495/ui/utils/remixAppLoader.server";
import searchRevenue from "~/data/searchRevenue.server";

const UserRevenuePage = () => {
  return <Table />;
};

export const loader: LoaderFunction = (args) => {
    return remixAppLoader(args, searchRevenue)
}

export default UserRevenuePage;
