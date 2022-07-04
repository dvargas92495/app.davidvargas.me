import remixAppAction from "~/package/backend/remixAppAction.server";
import remixAppLoader from "~/package/backend/remixAppLoader.server";
import React, { useState } from "react";
import { Form, useLoaderData } from "@remix-run/react";
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import Button from "~/package/components/Button";
import SuccessfulActionToast from "~/package/components/SuccessfulActionToast";
import TextInput from "~/package/components/TextInput";
import editTerraformVariable from "~/data/editTerraformVariable.server";
import listTerraformWorkspaces from "~/data/listTerraformWorkspaces.server";
export { default as ErrorBoundary } from "~/package/components/DefaultErrorBoundary";
export { default as CatchBoundary } from "~/package/components/DefaultCatchBoundary";

const UserTerraform = () => {
  const loaderData =
    useLoaderData<Awaited<ReturnType<typeof listTerraformWorkspaces>>>();
  const [key, setKey] = useState("");
  return (
    <div className={"mb-16"}>
      <Form className="w-96" method="post">
        <TextInput
          label={"Key"}
          name={"key"}
          onChange={(e) => setKey(e.target.value)}
        />
        <TextInput label={"Value"} name={"value"} />
        <Button>Update</Button>
      </Form>
      <h3>Workspaces:</h3>
      <ul className="flex">
        {loaderData.workspaces
          .map((w) => ({
            ...w,
            vars: w.vars.filter((v) => new RegExp(key).test(v.name)),
          }))
          .filter((w) => w.vars.length)
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((w) => (
            <li key={w.id}>
              {w.name}
              {!!w.vars.length && (
                <ul className="ml-4 list-disc">
                  {w.vars
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((v) => (
                      <li key={v.id}>{v.name}</li>
                    ))}
                </ul>
              )}
            </li>
          ))}
      </ul>
      <SuccessfulActionToast />
    </div>
  );
};

export const loader: LoaderFunction = (args) => {
  return remixAppLoader(args, ({ userId }) => {
    return listTerraformWorkspaces({ userId });
  });
};

export const action: ActionFunction = (args) => {
  return remixAppAction(args, {
    POST: ({ data, userId }) => {
      return editTerraformVariable({
        userId,
        key: data.key?.[0],
        value: data.value?.[0],
      });
    },
  });
};

export default UserTerraform;
