export { default as CatchBoundary } from "~/package/components/DefaultCatchBoundary";
export { default as ErrorBoundary } from "~/package/components/DefaultErrorBoundary";
import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import remixAppLoader from "~/package/backend/remixAppLoader.server";
import remixAppAction from "~/package/backend/remixAppAction.server";
import { Form, Link, useLoaderData } from "@remix-run/react";
import Button from "~/package/components/Button";
import getRule from "~/data/getRule.server";
import deleteRuleRecord from "~/data/deleteRuleRecord.server";

const RulePage = () => {
  const data = useLoaderData<Awaited<ReturnType<typeof getRule>>>();
  return (
    <div>
      <h1 className="font-bold text-xl mb-2">{data.label}</h1>
      <h2 className="font-semibold text-lg">Transforms</h2>
      <ul>
        <li>
          <b>Amount:</b> {data.transform.amount.operation} by{" "}
          {data.transform.amount.operand}
        </li>
        <li>
          <b>Code:</b> {data.transform.code}
        </li>
        <li>
          <b>Description:</b> {data.transform.description}
        </li>
      </ul>
      <h2 className="font-semibold text-lg">Conditions</h2>
      <ol>
        {data.conditions.map((c, order) => (
          <li key={order}>
            <b>{c.key}</b> {c.operation} <b>{c.value}</b>
          </li>
        ))}
      </ol>
      <Form method="delete">
        <Button>Delete</Button>
      </Form>
      <Link to={"/user/rules"}>
        <span className="absolute right-4 top-4 px-4 py-2 bg-orange-400 rounded-md cursor-pointer">
          {"<- Back"}
        </span>
      </Link>
    </div>
  );
};

export const loader: LoaderFunction = (args) => {
  return remixAppLoader(args, ({ params }) => getRule(params["uuid"] || ""));
};

export const action: ActionFunction = (args) => {
  return remixAppAction(args, {
    DELETE: ({ params, searchParams }) =>
      deleteRuleRecord(params["uuid"] || "").then(() => {
        return redirect(
          `/user/rules${
            Object.keys(searchParams).length
              ? ""
              : `?${new URLSearchParams(searchParams).toString()}`
          }`
        );
      }),
  });
};

export default RulePage;
