import { Form, useLoaderData, useOutletContext } from "@remix-run/react";
import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import insertRecordFromEtherscan from "~/data/insertRecordFromEtherscan.server";
import type listEtherscanRecords from "~/data/listEtherscanRecords.server";
import remixAppAction from "~/package/backend/remixAppAction.server";
import Button from "~/package/components/Button";
import DefaultCatchBoundary from "~/package/components/DefaultCatchBoundary";
import DefaultErrorBoundary from "~/package/components/DefaultErrorBoundary";
import TextInput from "~/package/components/TextInput";
import remixAppLoader from "~/package/backend/remixAppLoader.server";
import getEtherscan from "~/data/getEthereumTransaction.server";
import fixRecordFromEtherscan from "~/data/fixRecordFromEtherscan.server";
import Select from "~/package/components/Select";

const EtherscanRecord = () => {
  const recordSelected = useLoaderData<Awaited<ReturnType<typeof getEtherscan>>>();
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
      <Form method="put" className="mt-4">
        <input
          type={"hidden"}
          name={"date"}
          defaultValue={recordSelected.date}
        />
        <input
          type={"hidden"}
          name={"from"}
          defaultValue={recordSelected.from}
        />
        <input type={"hidden"} name={"to"} defaultValue={recordSelected.to} />
        <input
          type={"hidden"}
          name={"value"}
          defaultValue={recordSelected.value}
        />
        <input
          type={"hidden"}
          name={"gas"}
          defaultValue={recordSelected.gas}
        />
        <Button>Fix</Button>
      </Form>
    </div>
  );
};

export const action: ActionFunction = (args) => {
  return remixAppAction(args, {
    POST: ({ data, params }) =>
      insertRecordFromEtherscan({ data, params }).then(() =>
        redirect("/user/ethereum")
      ),
    PUT: ({ userId, params }) =>
      fixRecordFromEtherscan({ userId, params }).then(() =>
        redirect("/user/ethereum")
      ),
  });
};

export const loader: LoaderFunction = (args) => {
  return remixAppLoader(args, getEtherscan);
};

export const ErrorBoundary = DefaultErrorBoundary;
export const CatchBoundary = DefaultCatchBoundary;

export default EtherscanRecord;
