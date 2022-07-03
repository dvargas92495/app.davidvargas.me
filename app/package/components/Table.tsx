import { useLoaderData, useSearchParams } from "@remix-run/react";
import mixClasses from "../utils/mixClasses";

const Table = ({
  onRowClick,
  className,
  tableClassName,
  thClassName,
  theadClassName,
  getTrClassName = (index: number) =>
    `cursor-pointer ${
      index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"
    } hover:bg-gray-300 whitespace-pre-wrap`,
  getTdClassName = () => `p-3 border-2 border-gray-400`,
}: {
  onRowClick?: (row: any, index: number) => void;
  className?: string;
  tableClassName?: string;
  thClassName?: string;
  theadClassName?: string;
  getTrClassName?: (index: number) => string;
  getTdClassName?: (index: number) => string;
}) => {
  const { data = [], columns = [], count } = useLoaderData<{
    columns: { Header: string; accessor: string }[];
    data: Record<string, string | number>[];
    count: number;
  }>();

  const [searchParams, setSearchParams] = useSearchParams();
  const index = Number(searchParams.get("index")) || 1;
  const size = Math.max(Number(searchParams.get("size")) || 10, data.length);
  const {
    pagination: { pageIndex, pageSize, pageCount },
  } = {
    pagination: {
      pageIndex: index - 1,
      pageSize: size,
      pageCount: Math.ceil(count / size),
    },
  };

  return (
    <div className={mixClasses("w-full", className)}>
      <table
        className={mixClasses(
          "border-2 border-sky-600 w-full mb-2",
          tableClassName
        )}
      >
        <thead className={theadClassName}>
          <tr>
            {columns.map((column) => (
              <th
                key={column.accessor}
                className={mixClasses(
                  "border-b-2 border-b-orange-400 bg-sky-400 text-black font-bold cursor-pointer",
                  thClassName
                )}
              >
                {column.Header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => {
            return (
              <tr
                key={row.uuid || row.id || index}
                className={getTrClassName(index)}
                onClick={() => onRowClick?.(data[index], index)}
              >
                {columns.map((cell, jndex) => {
                  return (
                    <td
                      key={cell.accessor}
                      className={getTdClassName(jndex)}
                    >
                      {row[cell.accessor]}
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
              disabled={pageIndex === 0}
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
              disabled={pageIndex === 0}
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
              disabled={false}
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
              disabled={false}
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
