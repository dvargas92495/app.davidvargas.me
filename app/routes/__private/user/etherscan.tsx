import remixAppLoader from "@dvargas92495/ui/utils/remixAppLoader.server";
import {
  ActionFunction,
  Form,
  LoaderFunction,
  useActionData,
  useCatch,
} from "remix";
import { CatchBoundaryComponent } from "@remix-run/server-runtime/routeModules";
import Table from "~/components/Table";
import React, { useState } from "react";
import DefaultErrorBoundary from "~/components/DefaultErrorBoundary";
import listEtherscanRecords from "~/data/listEtherscanRecords.server";
import Dialog from "~/components/Dialog";
import remixAppAction from "@dvargas92495/ui/utils/remixAppAction.server";
import insertRecordFromEtherscan from "~/data/insertRecordFromEtherscan.server";
import TextInput from "~/components/TextInput";
import Button from "~/components/Button";

const UserEtherscan = () => {
  const actionData = useActionData();
  const [recordSelected, setRecordSelected] =
    useState<
      Awaited<ReturnType<typeof listEtherscanRecords>>["data"][number]
    >();
  return (
    <>
      <Table onRowClick={(row) => setRecordSelected(row)} />
      <Dialog
        isOpen={!!recordSelected}
        onClose={() => setRecordSelected(undefined)}
        title={"Save Record"}
      >
        <Form method="post">
          <TextInput
            label={"Transaction"}
            name={"hash"}
            defaultValue={recordSelected?.id}
          />
          <TextInput
            label={"Date"}
            name={"date"}
            defaultValue={recordSelected?.date}
          />
          <TextInput
            label={"Original Value"}
            name={"value"}
            defaultValue={recordSelected?.value}
          />
          <TextInput
            label={"From"}
            name={"from"}
            defaultValue={recordSelected?.from}
          />
          <TextInput
            label={"To"}
            name={"to"}
            defaultValue={recordSelected?.to}
          />
          <TextInput
            label={"Original Gas"}
            name={"gas"}
            defaultValue={recordSelected?.gas}
          />
          <TextInput
            label={"Type"}
            name={"type"}
            defaultValue={recordSelected?.type}
          />
          <TextInput
            label={"Category"}
            name={"category"}
            defaultValue={"revenue"}
          />
          <TextInput label={"Description"} name={"description"} />
          <TextInput
            label={"Amount"}
            name={"amount"}
            defaultValue={recordSelected?.value}
          />
          <Button>Save</Button>
        </Form>
      </Dialog>
      {actionData && (
        <div className="flex-grow border-2 border-gray-500 border-opacity-50 border-dashed rounded-lg p-4">
          <h1 className="text-2xl font-bold mb-6">Response</h1>
          <pre className="p-8 bg-green-800 bg-opacity-10 text-green-900 border-green-900 border-2 rounded-sm overflow-auto">
            {JSON.stringify(actionData.data, null, 4)}
          </pre>
        </div>
      )}
    </>
  );
};

export const loader: LoaderFunction = (args) => {
  return remixAppLoader(args, ({ userId }) => listEtherscanRecords(userId));
};

export const action: ActionFunction = (args) => {
  return remixAppAction(args, insertRecordFromEtherscan);
};

export const ErrorBoundary = DefaultErrorBoundary;
export const CatchBoundary: CatchBoundaryComponent = () => {
  const caught = useCatch();
  return (
    <DefaultErrorBoundary
      error={
        new Error(
          typeof caught.data === "object"
            ? JSON.stringify(caught.data)
            : caught.data
        )
      }
    />
  );
};

export default UserEtherscan;
