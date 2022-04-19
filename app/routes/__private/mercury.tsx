import remixAppLoader from "@dvargas92495/ui/utils/remixAppLoader.server";
import { ActionFunction, Form, LoaderFunction, useActionData } from "remix";
import Table from "~/components/Table";
import React, { useState } from "react";
import DefaultErrorBoundary from "~/components/DefaultErrorBoundary";
import Dialog from "~/components/Dialog";
import remixAppAction from "@dvargas92495/ui/utils/remixAppAction.server";
import insertRecordFromEtherscan from "~/data/insertRecordFromEtherscan.server";
import TextInput from "~/components/TextInput";
import Button from "~/components/Button";
import listMercuryRecords from "~/data/listMercuryRecords.server";
import DefaultCatchBoundary from "~/components/DefaultCatchBoundary";

const UserMercury = () => {
  const actionData = useActionData();
  const [recordSelected, setRecordSelected] =
    useState<Awaited<ReturnType<typeof listMercuryRecords>>["data"][number]>();
  return (
    <>
      <Table onRowClick={(row) => setRecordSelected(row)} />
      <Dialog
        isOpen={!!recordSelected}
        onClose={() => setRecordSelected(undefined)}
        title={"Save Record"}
      >
        <Form method="post">
          <TextInput label={"Amount"} name={"amount"} />
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
  return remixAppLoader(args, ({ userId }) => listMercuryRecords(userId));
};

export const action: ActionFunction = (args) => {
  return remixAppAction(args, ({ userId, data }) =>
    insertRecordFromEtherscan({ userId, data }).catch((e) => {
      throw new Response(e.message, { status: 500 });
    })
  );
};

export const ErrorBoundary = DefaultErrorBoundary;
export const CatchBoundary = DefaultCatchBoundary;

export default UserMercury;
