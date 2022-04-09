import remixAppAction from "@dvargas92495/ui/utils/remixAppAction.server";
import remixAppLoader from "@dvargas92495/ui/utils/remixAppLoader.server";
import React, { useMemo } from "react";
import {
  ActionFunction,
  Form,
  Link,
  LoaderFunction,
  Outlet,
  useActionData,
  useLoaderData,
  useNavigate,
  useTransition,
  useSearchParams,
} from "remix";
import insertRevenueFromStripe from "~/data/insertRevenueFromStripe.server";
import listRevenueFromStripe from "~/data/listRevenueFromStripe.server";

const PAGE_SIZE = 20;

type InputProps = {
  label?: React.ReactNode;
} & Omit<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
  "type" | "required"
>;

const TextInput = ({ label, name, disabled, ...inputProps }: InputProps) => {
  const transition = useTransition();
  const loading = useMemo(
    () => transition.state === "submitting",
    [transition]
  );
  return (
    <div className="mb-6">
      <label
        htmlFor={name}
        className="block mb-2 text-sm font-medium text-gray-900"
      >
        {label}
      </label>
      <input
        name={name}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:opacity-25"
        required
        disabled={typeof disabled === "undefined" ? loading : disabled}
        {...inputProps}
      />
    </div>
  );
};

const NumberInput = ({ label, name, disabled, ...inputProps }: InputProps) => {
  const transition = useTransition();
  const loading = useMemo(
    () => transition.state === "submitting",
    [transition]
  );
  return (
    <div className="mb-6">
      <label
        htmlFor={name}
        className="block mb-2 text-sm font-medium text-gray-900"
      >
        {label}
      </label>
      <input
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:opacity-25"
        type={"number"}
        name={name}
        disabled={typeof disabled === "undefined" ? loading : disabled}
        required
        {...inputProps}
      />
    </div>
  );
};

const Button: React.FC<{ disabled?: boolean }> = ({ children, disabled }) => {
  const transition = useTransition();
  const loading = useMemo(
    () => transition.state === "submitting",
    [transition]
  );
  return (
    <button
      type="submit"
      className="px-8 py-3 font-semibold rounded-full bg-sky-500"
      disabled={typeof disabled === "undefined" ? loading : disabled}
    >
      {children}
    </button>
  );
};

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
  return remixAppLoader(args, ({ userId, searchParams }) => {
    console.log(searchParams);
    if (userId !== "user_21WUZXJqWrD2UpiymzkSd5uBB5k")
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
    if (userId !== "user_21WUZXJqWrD2UpiymzkSd5uBB5k")
      throw new Response(`User not authorized to access this endpoint`, {
        status: 403,
      });
    if (method === "POST") return insertRevenueFromStripe({ id: data.pi?.[0] });
    else throw new Response(`Unsupported method: ${method}`, { status: 404 });
  });
};

export default UserStripe;
