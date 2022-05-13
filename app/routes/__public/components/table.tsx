import React from "react";
import Table from "~/package/components/Table";
import type { LoaderFunction } from "@remix-run/node";

const TablePage = () => {
  return (
    <>
      <Table />
    </>
  );
};

export const loader: LoaderFunction = () => {
  return {
    columns: [
      { Header: "First", accessor: "first" },
      { Header: "Second", accessor: "second" },
      { Header: "Third", accessor: "third" },
    ],
    data: Array(30)
      .fill(null)
      .map((_, i) => i + 1)
      .map((i) => ({
        first: i.toString(),
        second: i.toString(),
        third: i.toString(),
      })),
  };
};

export default TablePage;
