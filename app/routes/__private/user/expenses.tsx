import React, { useEffect, useState } from "react";
import Table from "~/package/components/Table";
import { Form, useActionData } from "@remix-run/react";
import { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import remixAppLoader from "~/package/backend/remixAppLoader.server";
import searchExpenses from "~/data/searchExpenses.server";
import Dialog from "~/package/components/Dialog";
import Button from "~/package/components/Button";
import TextInput from "~/package/components/TextInput";
import Toast from "~/package/components/Toast";
import deleteExpenseRecord from "~/data/deleteExpenseRecord.server";
import remixAppAction from "~/package/backend/remixAppAction.server";
import DefaultErrorBoundary from "~/package/components/DefaultErrorBoundary";
import DefaultCatchBoundary from "~/package/components/DefaultCatchBoundary";

const UserExpensesPage = () => {
  const actionData = useActionData();
  const [recordSelected, setRecordSelected] =
    useState<Awaited<ReturnType<typeof searchExpenses>>["data"][number]>();
  const [toastOpen, setToastOpen] = useState(false);
  useEffect(() => {
    if (actionData?.success) setToastOpen(true);
  }, [actionData]);
  return (
    <>
      <Table onRowClick={(row) => setRecordSelected(row)} />
      <Dialog
        isOpen={!!recordSelected}
        onClose={() => setRecordSelected(undefined)}
        title={"Delete Record"}
      >
        <Form method="delete">
          <TextInput name={"uuid"} defaultValue={recordSelected?.uuid} />
          <Button>Delete</Button>
        </Form>
      </Dialog>
      {actionData?.success && (
        <Toast
          message={"Successfully Deleted Row!"}
          isOpen={toastOpen}
          onClose={() => setToastOpen(false)}
        />
      )}
    </>
  );
};

export const loader: LoaderFunction = (args) => {
  return remixAppLoader(args, searchExpenses);
};

export const action: ActionFunction = (args) => {
  return remixAppAction(args, deleteExpenseRecord);
};

export const ErrorBoundary = DefaultErrorBoundary;

export const CatchBoundary = DefaultCatchBoundary;

export default UserExpensesPage;
