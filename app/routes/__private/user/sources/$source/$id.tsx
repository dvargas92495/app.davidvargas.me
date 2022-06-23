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

const CODES = [
  { id: 1520, label: "Computer & Office Equipment" },
  { id: 3000, label: "Owner's Capital" },
  { id: 3110, label: "Owner's Investment" },
  { id: 3120, label: "Owner's Draw" },
  { id: 4300, label: "Service" },
  { id: 4400, label: "Markup on Reimbursable Expenses" },
  { id: 4715, label: "Other Income" },
  { id: 5300, label: "Subcontractors" },
  { id: 6110, label: "Automobile Expense" },
  { id: 6140, label: "Business License & Fees" },
  { id: 6155, label: "Dues & Subscriptions" },
  { id: 6320, label: "Insurance" },
  { id: 6680, label: "Wages & Salaries" },
];

const UserSourceEvent = () => {
  const recordSelected =
    useLoaderData<Awaited<ReturnType<typeof getSourceTransaction>>>();
  return (
    <Form method="put">
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
        redirect("/user/sources")
      ),
  });
};

export const loader: LoaderFunction = (args) => {
  return remixAppLoader(args, getSourceTransaction);
};

export default UserSourceEvent;
