import React, { useEffect, useState } from "react";
import Table from "@dvargas92495/ui/components/Table";
import { Form, useActionData } from "@remix-run/react";
import { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import remixAppLoader from "@dvargas92495/ui/utils/remixAppLoader.server";
import searchExpenses from "~/data/searchExpenses.server";
import Dialog from "@dvargas92495/ui/components/Dialog";
import Button from "@dvargas92495/ui/components/Button";
import TextInput from "@dvargas92495/ui/components/TextInput";
import Toast from "@dvargas92495/ui/components/Toast";
import deleteExpenseRecord from "~/data/deleteExpenseRecord.server";
import remixAppAction from "@dvargas92495/ui/utils/remixAppAction.server";
import DefaultErrorBoundary from "@dvargas92495/ui/components/DefaultErrorBoundary";
import DefaultCatchBoundary from "@dvargas92495/ui/components/DefaultCatchBoundary";

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
