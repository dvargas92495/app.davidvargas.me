import React from "react";
import Table from "~/components/Table";
import {LoaderFunction} from "remix";
import remixAppLoader from "@dvargas92495/ui/utils/remixAppLoader.server";
import searchTransfers from "~/data/searchTransfers.server";

const UserTransfersPage = () => {
  return <Table />;
};

export const loader: LoaderFunction = (args) => {
    return remixAppLoader(args, searchTransfers)
}

export default UserTransfersPage;
