import React from "react";
import Table from "~/package/components/Table";

const TablePage = () => {
  return (
    <>
      <Table />
    </>
  );
};

export const loader = () => ({
  count: 20,
  columns: [
    { Header: "First", accessor: "first" },
    { Header: "Second", accessor: "second" },
    { Header: "Third", accessor: "third" },
  ],
  data: Array(10)
    .fill(null)
    .map((_, i) => i + 1)
    .map((i) => ({
      first: i.toString(),
      second: i.toString(),
      third: i.toString(),
    })),
});

export default TablePage;
