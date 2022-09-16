export { default as CatchBoundary } from "~/package/components/DefaultCatchBoundary";
export { default as ErrorBoundary } from "~/package/components/DefaultErrorBoundary";
import { ActionFunction, redirect } from "@remix-run/node";
import remixAppAction from "~/package/backend/remixAppAction.server";
import { Form, Link } from "@remix-run/react";
import Button from "~/package/components/Button";
import createSource from "~/data/createSource.server";
import TextInput from "~/package/components/TextInput";

const NewSourcePage = () => {
  return (
    <>
      <Link to={"/user/Sources"}>
        <span className="absolute right-4 top-4 px-4 py-2 bg-orange-400 rounded-md cursor-pointer">
          {"<- Back"}
        </span>
      </Link>
      <Form method={"post"}>
        <TextInput name={"label"} label={"Label"} />
        <TextInput name={"snapshot"} label={"Snapshot URL"} />
        <TextInput name={"feed"} label={"Feed URL"} />
        <TextInput name={"credential"} label={"Credential"} />
        <Button>Create</Button>
      </Form>
    </>
  );
};

export const action: ActionFunction = (args) => {
  return remixAppAction(args, {
    POST: ({ userId, data, searchParams }) =>
      createSource({ userId, data }).then(({ uuid }) => {
        return redirect(
          `/user/sources/${uuid}${
            Object.keys(searchParams).length
              ? ""
              : `?${new URLSearchParams(searchParams).toString()}`
          }`
        );
      }),
  });
};

export default NewSourcePage;
