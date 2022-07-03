import { Form, useLoaderData } from "@remix-run/react";
import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import insertEventFromSource from "~/data/insertEventFromSource.server";
import remixAppAction from "~/package/backend/remixAppAction.server";
import Button from "~/package/components/Button";
export { default as CatchBoundary } from "~/package/components/DefaultCatchBoundary";
export { default as ErrorBoundary } from "~/package/components/DefaultErrorBoundary";
import TextInput from "~/package/components/TextInput";
import remixAppLoader from "~/package/backend/remixAppLoader.server";
import getSourceTransaction from "~/data/getSourceTransaction.server";
import AutoCompleteInput from "~/package/components/AutoCompleteInput";
import CODES from "~/enums/taxCodes";

const UserSourceEvent = () => {
  const recordSelected =
    useLoaderData<Awaited<ReturnType<typeof getSourceTransaction>>>();
  return (
    <Form method="put" key={recordSelected.id}>
      <TextInput
        label={"Date"}
        name={"date"}
        defaultValue={recordSelected.date}
      />
      <AutoCompleteInput
        label={"Code"}
        name={"code"}
        options={CODES}
        defaultValue={recordSelected.code}
      />
      <TextInput
        label={"Description"}
        name={"description"}
        defaultValue={recordSelected.description}
      />
      <TextInput
        label={"Amount"}
        name={"amount"}
        defaultValue={recordSelected.amount}
      />
      <Button>Save</Button>
    </Form>
  );
};

export const action: ActionFunction = (args) => {
  return remixAppAction(args, {
    PUT: ({ data, params }) =>
      insertEventFromSource({ data, params }).then(() =>
        redirect(`/user/sources/`)
      ),
  });
};

export const loader: LoaderFunction = (args) => {
  return remixAppLoader(args, getSourceTransaction);
};

export default UserSourceEvent;
