import remixAppLoader from "@dvargas92495/ui/utils/remixAppLoader.server";
import React from "react";
import {
  Link,
  LoaderFunction,
  Outlet,
  useLoaderData,
  useNavigate,
} from "remix";
import listMigrations from "~/data/listMigrations.server";

const PAGE_SIZE = 20;

const UserMysql = () => {
  const data = useLoaderData<
    Awaited<ReturnType<typeof listMigrations>> & { page: number }
  >();
  const { values = [], page = 1 } = data;
  const navigate = useNavigate();
  return (
    <>
      <div className="flex">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Start</th>
              <th>Finished</th>
              <th>Checksum</th>
            </tr>
          </thead>
          <tbody>
            {values.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((v) => (
              <tr
                key={v.uuid}
                className="hover:bg-slate-400 cursor-pointer"
                onClick={() => navigate(`/user/mysql/${v.uuid}`)}
              >
                <td>{v.name}</td>
                <td>{new Date(v.start).toLocaleString()}</td>
                <td>{new Date(v.end).toLocaleString()}</td>
                <td>{v.checksum}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4}>
                <Link to={`/user/mysql?page=${page - 1}`}>{"<"}</Link>
                <Link to={`/user/mysql?page=${page + 1}`}>{">"}</Link>
              </td>
            </tr>
          </tfoot>
        </table>
        <div className="ml-16">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export const loader: LoaderFunction = (args) => {
  return remixAppLoader(args, ({ userId, searchParams }) => {
    if (
      userId !== "user_21WUZXJqWrD2UpiymzkSd5uBB5k" &&
      userId !== "user_27XvTc1WHEc33fbqm6HI5Xe4Ogf"
    )
      throw new Response(`User not authorized to access this endpoint`, {
        status: 403,
      });
    return listMigrations().then(({ values }) => ({
      values,
      page: searchParams.page ? Number(searchParams.page) : 1,
    }));
  });
};

export default UserMysql;
