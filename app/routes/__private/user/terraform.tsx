import remixAppAction from "@dvargas92495/ui/utils/remixAppAction.server";
import remixAppLoader from "@dvargas92495/ui/utils/remixAppLoader.server";
import React, { useState } from "react";
import { ActionFunction, Form, LoaderFunction, useLoaderData } from "remix";
import Button from "~/components/Button";
import DefaultCatchBoundary from "~/components/DefaultCatchBoundary";
import DefaultErrorBoundary from "~/components/DefaultErrorBoundary";
import SuccessfulActionToast from "~/components/SuccessfulActionToast";
import TextInput from "~/components/TextInput";
import editTerraformVariable from "~/data/editTerraformVariable.server";
import listTerraformWorkspaces from "~/data/listTerraformWorkspaces.server";

const UserTerraform = () => {
  const loaderData =
    useLoaderData<Awaited<ReturnType<typeof listTerraformWorkspaces>>>();
  const [key, setKey] = useState("");
  return (
    <div style={{ marginBottom: 64 }}>
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
      <ul className="list-disc">
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
  return remixAppAction(args, ({ data, userId }) => {
    return editTerraformVariable({
      userId,
      key: data.key?.[0],
      value: data.value?.[0],
    });
  });
};

export const ErrorBoundary = DefaultErrorBoundary;

export const CatchBoundary = DefaultCatchBoundary;

export default UserTerraform;
