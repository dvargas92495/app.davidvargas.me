import remixAppAction from "~/package/backend/remixAppAction.server";
import remixAppLoader from "~/package/backend/remixAppLoader.server";
import React from "react";
import {
  Outlet,
  useLoaderData,
  useNavigate,
  useSearchParams,
  Form,
  useActionData,
} from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import Button from "~/package/components/Button";
import NumberInput from "~/package/components/NumberInput";
import TextInput from "~/package/components/TextInput";
import insertRevenueFromStripe from "~/data/insertRevenueFromStripe.server";
import listRevenueFromStripe from "~/data/listRevenueFromStripe.server";

const PAGE_SIZE = 20;

const UserStripe = () => {
  const data = useLoaderData<
    Awaited<ReturnType<typeof listRevenueFromStripe>> & { page: number }
  >();
  const { values = [] } = data;
  const actionData = useActionData();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.has("page") ? Number(searchParams.get("page")) : 1;
  const filter = searchParams.has("filter")
    ? searchParams.get("filter") || ""
    : "";
  return (
    <>
      <div className="flex justify-between mb-8">
        <Form method="post" replace={true}>
          <div className="w-96">
            <TextInput label={"Stripe ID"} name={"pi"} placeholder="pi_1234" />
            <Button>Insert</Button>
          </div>
        </Form>
        <div className="ml-16 flex-grow">
          <h2 className="mb-2 text-lg">Results</h2>
          <pre className={"border-2 border-dotted p-1"}>
            {actionData ? JSON.stringify(actionData, null, 4) : "None"}
          </pre>
        </div>
      </div>
      <Form method="get" replace={true} className="mb-6">
        <div className="w-96">
          <TextInput label={"Filter"} name={"filter"} placeholder="pi_1234" />
          <NumberInput defaultValue={page} name={"page"} label={"Page"} />
          <Button>Search</Button>
        </div>
      </Form>
      <div className="flex">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Connect</th>
            </tr>
          </thead>
          <tbody>
            {values
              .filter((f) => !filter || f.product === filter)
              .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
              .map((v) => (
                <tr
                  key={v.uuid}
                  className="hover:bg-slate-400 cursor-pointer"
                  onClick={() => navigate(`/user/stripe/${v.uuid}`)}
                >
                  <td>{v.product}</td>
                  <td>{v.date}</td>
                  <td>{v.amount}</td>
                  <td>{v.connect}</td>
                </tr>
              ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4}>
                <button
                  onClick={() =>
                    setSearchParams(
                      { page: (page - 1).toString(), filter },
                      { replace: true }
                    )
                  }
                >
                  {"<"}
                </button>
                <button
                  onClick={() =>
                    setSearchParams(
                      { page: (page + 1).toString(), filter },
                      { replace: true }
                    )
                  }
                >
                  {">"}
                </button>
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
  return remixAppLoader(args, ({ userId }) => {
    if (
      userId !== "user_21WUZXJqWrD2UpiymzkSd5uBB5k" &&
      userId !== "user_27XvTc1WHEc33fbqm6HI5Xe4Ogf"
    )
      throw new Response(`User not authorized to access this endpoint`, {
        status: 403,
      });
    return listRevenueFromStripe().then(({ values }) => ({
      values,
    }));
  });
};

export const action: ActionFunction = (args) => {
  return remixAppAction(args, ({ data, userId, method }) => {
    if (
      userId !== "user_21WUZXJqWrD2UpiymzkSd5uBB5k" &&
      userId !== "user_27XvTc1WHEc33fbqm6HI5Xe4Ogf"
    )
      throw new Response(`User not authorized to access this endpoint`, {
        status: 403,
      });
    if (method === "POST") return insertRevenueFromStripe({ id: data.pi?.[0] });
    else throw new Response(`Unsupported method: ${method}`, { status: 404 });
  });
};

export default UserStripe;
