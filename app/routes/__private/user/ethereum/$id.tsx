import { Form, useLoaderData, useOutletContext } from "@remix-run/react";
import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import insertRecordFromEthereum from "~/data/insertRecordFromEthereum.server";
import remixAppAction from "~/package/backend/remixAppAction.server";
import Button from "~/package/components/Button";
import DefaultCatchBoundary from "~/package/components/DefaultCatchBoundary";
import DefaultErrorBoundary from "~/package/components/DefaultErrorBoundary";
import TextInput from "~/package/components/TextInput";
import remixAppLoader from "~/package/backend/remixAppLoader.server";
import getEthereumTransaction from "~/data/getEthereumTransaction.server";
import Select from "~/package/components/Select";

const EthereumRecord = () => {
  const recordSelected = useLoaderData<Awaited<ReturnType<typeof getEthereumTransaction>>>();
  return (
    <div className="flex gap-8">
      <Form method="post" className="mt-4 flex gap-2">
        <div key={recordSelected.hash}>
          <TextInput
            name={"hash"}
            defaultValue={recordSelected.hash}
            label={"Hash"}
          />
          <TextInput
            name={"date"}
            defaultValue={recordSelected.date}
            label={"Date"}
          />
          <TextInput
            label={"From"}
            name={"from"}
            defaultValue={recordSelected.from}
          />
          <TextInput
            label={"To"}
            name={"to"}
            defaultValue={recordSelected.to}
          />
          <TextInput
            label={"Original Value"}
            name={"value"}
            defaultValue={recordSelected.value}
          />
          <TextInput
            label={"Original Gas"}
            name={"gas"}
            defaultValue={recordSelected.gas}
          />
        </div>
        <div>
          <Select
            label={"Category"}
            name={"category"}
            options={["revenue", "expense", "personal"]}
          />
          <TextInput label={"Description"} name={"description"} />
          <TextInput
            label={"Amount"}
            name={"amount"}
            defaultValue={recordSelected.value}
          />
          <Button>Save</Button>
        </div>
      </Form>
    </div>
  );
};

export const action: ActionFunction = (args) => {
  return remixAppAction(args, {
    POST: ({ data, params }) =>
      insertRecordFromEthereum({ data, params }).then(() =>
        redirect("/user/ethereum")
      ),
  });
};

export const loader: LoaderFunction = (args) => {
  return remixAppLoader(args, getEthereumTransaction);
};

export const ErrorBoundary = DefaultErrorBoundary;
export const CatchBoundary = DefaultCatchBoundary;

export default EthereumRecord;
