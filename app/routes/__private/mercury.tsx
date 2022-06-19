import remixAppLoader from "~/package/backend/remixAppLoader.server";
import { Form, useActionData } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import Table from "~/package/components/Table";
import React, { useState } from "react";
import DefaultErrorBoundary from "~/package/components/DefaultErrorBoundary";
import Dialog from "~/package/components/Dialog";
import remixAppAction from "~/package/backend/remixAppAction.server";
import insertRecordFromEthereum from "~/data/insertRecordFromEthereum.server";
import TextInput from "~/package/components/TextInput";
import Button from "~/package/components/Button";
import listMercuryRecords from "~/data/listMercuryRecords.server";
import DefaultCatchBoundary from "~/package/components/DefaultCatchBoundary";

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
  return remixAppAction(args, ({ data, params }) =>
    insertRecordFromEthereum({ data, params }).catch((e) => {
      throw new Response(e.message, { status: 500 });
    })
  );
};

export const ErrorBoundary = DefaultErrorBoundary;
export const CatchBoundary = DefaultCatchBoundary;

export default UserMercury;
