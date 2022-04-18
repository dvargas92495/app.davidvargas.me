import React from "react";
import Table from "~/components/Table";
import { LoaderFunction } from "remix";
import remixAppLoader from "@dvargas92495/ui/utils/remixAppLoader.server";
import searchExpenses from "~/data/searchExpenses.server";

const UserExpensesPage = () => {
  return <Table />;
};

export const loader: LoaderFunction = (args) => {
  return remixAppLoader(args, searchExpenses);
};

export default UserExpensesPage;
