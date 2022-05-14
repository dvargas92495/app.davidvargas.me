import React from "react";
import {
  createTable,
  useTableInstance,
  getCoreRowModelSync,
  getFilteredRowModelSync,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { useLoaderData, useSearchParams } from "@remix-run/react";

const table = createTable();

const Table = ({
  onRowClick,
  tableClassName = "border-2 border-sky-600 w-full mb-2",
  thClassName = "border-b-2 border-b-orange-400 bg-sky-400 text-black font-bold cursor-pointer",
  theadClassName = "",
  getTrClassName = (index: number) =>
    `cursor-pointer ${
      index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"
    } hover:bg-gray-300`,
  getTdClassName = () => `p-3 border-2 border-gray-400`,
}: {
  onRowClick?: (row: any, index: number) => void;
  tableClassName?: string;
  thClassName?: string;
  theadClassName?: string;
  getTrClassName?: (index: number) => string;
  getTdClassName?: (index: number) => string;
}) => {
  const { data, columns: loaderColumns } = useLoaderData<{
    columns: { Header: string; accessor: string }[];
    data: {}[];
  }>();
  const columns = React.useMemo(
    () =>
      loaderColumns.map((col) =>
        table.createDataColumn(
          (row) => (row as Record<string, unknown>)[col.accessor],
          {
            id: col.accessor,
            header: col.Header,
          }
        )
      ),
    []
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const index = Number(searchParams.get("index")) || 1;
  const size = Number(searchParams.get("size")) || 10;
  const {
    getHeaderGroups,
    getRowModel,
    getCanNextPage,
    getCanPreviousPage,
    getState,
  } = useTableInstance(table, {
    columns,
    data,
    state: {
      pagination: {
        pageIndex: index - 1,
        pageSize: size,
        pageCount: Math.ceil(data.length / size),
      },
    },

    getCoreRowModel: getCoreRowModelSync(),
    getFilteredRowModel: getFilteredRowModelSync(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  const {
    pagination: { pageIndex, pageSize, pageCount },
  } = getState();

  return (
    <div className="w-full">
      <table className={tableClassName}>
        <thead className={theadClassName}>
          {getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((column) => (
                <th key={column.id} className={thClassName}>
                  {column.renderHeader()}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {getRowModel().rows.map((row, index) => {
            return (
              <tr
                key={row.id}
                className={getTrClassName(index)}
                onClick={() => onRowClick?.(data[index], index)}
              >
                {row.getAllCells().map((cell, jndex) => {
                  return (
                    <td
                      {...cell}
                      key={cell.id}
                      className={getTdClassName(jndex)}
                    >
                      {cell.renderCell()}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {pageCount > 1 && (
        <div className="w-full flex justify-between items-center">
          <div>
            <select
              value={pageSize}
              onChange={(e) => {
                setSearchParams({
                  ...Object.fromEntries(searchParams),
                  size: e.target.value,
                });
              }}
              className={"rounded-lg"}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setSearchParams({
                  ...Object.fromEntries(searchParams),
                  index: "1",
                })
              }
              disabled={!getCanPreviousPage()}
              className={"rounded-full hover:bg-gray-100 cursor-pointer p-1"}
            >
              {"<<"}
            </button>
            <button
              onClick={() =>
                setSearchParams({
                  ...Object.fromEntries(searchParams),
                  index: pageIndex.toString(),
                })
              }
              disabled={!getCanPreviousPage()}
              className={"rounded-full hover:bg-gray-100 cursor-pointer p-1"}
            >
              {"<"}
            </button>
            <button
              onClick={() =>
                setSearchParams({
                  ...Object.fromEntries(searchParams),
                  index: (pageIndex + 2).toString(),
                })
              }
              disabled={!getCanNextPage()}
              className={"rounded-full hover:bg-gray-100 cursor-pointer p-1"}
            >
              {">"}
            </button>
            <button
              onClick={() =>
                setSearchParams({
                  ...Object.fromEntries(searchParams),
                  index: pageCount.toString(),
                })
              }
              disabled={!getCanNextPage()}
              className={"rounded-full hover:bg-gray-100 cursor-pointer p-1"}
            >
              {">>"}
            </button>
            <span>
              Page{" "}
              <strong>
                {pageIndex + 1} of {pageCount}
              </strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
