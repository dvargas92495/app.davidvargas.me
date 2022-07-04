import remixAppLoader from "~/package/backend/remixAppLoader.server";
export { default as CatchBoundary } from "~/package/components/DefaultCatchBoundary";
export { default as ErrorBoundary } from "~/package/components/DefaultErrorBoundary";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import TextInput from "~/package/components/TextInput";
import Button from "~/package/components/Button";
import remixAppAction from "~/package/backend/remixAppAction.server";
import getTerraformInfo from "~/data/getTerraformInfo.server";
import saveTerraformInfo from "~/data/saveTerraformInfo.server";

type LoaderData = Awaited<ReturnType<typeof getTerraformInfo>>;

const TerraformPage = () => {
  const data = useLoaderData<LoaderData>();
  return (
    <Form method={"post"}>
      <TextInput
        name={"organization"}
        label={"Organization"}
        defaultValue={data?.organization || ""}
      />
      <TextInput
        name={"organizationApiToken"}
        label={"Organization Token"}
        defaultValue={data?.organizationApiToken || ""}
      />
      <Button>Save</Button>
    </Form>
  );
};

export const action: ActionFunction = (args) => {
  return remixAppAction(args, saveTerraformInfo);
};

export const loader: LoaderFunction = (args) => {
  return remixAppLoader(args, getTerraformInfo);
};

export default TerraformPage;
