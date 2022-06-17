import React, { useEffect, useMemo, useState } from "react";
import Table from "~/package/components/Table";
import { Outlet, useNavigate, useSearchParams } from "@remix-run/react";
import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import remixAppLoader from "~/package/backend/remixAppLoader.server";
import searchExpenses from "~/data/searchExpenses.server";
import Toast from "~/package/components/Toast";
import deleteExpenseRecord from "~/data/deleteExpenseRecord.server";
import remixAppAction from "~/package/backend/remixAppAction.server";
import DefaultErrorBoundary from "~/package/components/DefaultErrorBoundary";
import DefaultCatchBoundary from "~/package/components/DefaultCatchBoundary";

const UserExpensesPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [toastOpen, setToastOpen] = useState(false);
  const paramString = useMemo(() => {
    const sp = searchParams.toString();
    return sp ? `?${sp}` : "";
  }, [searchParams]);
  useEffect(() => {
    if (searchParams.get("delete") === "true") setToastOpen(true);
  }, [searchParams, setToastOpen]);
  return (
    <>
      <div className="flex gap-8">
        <div className="max-w-3xl w-full">
          <Table
            onRowClick={(row) =>
              navigate(`/user/expenses/${row.uuid}${paramString}`)
            }
          />
        </div>
        <div>
          <Outlet />
        </div>
      </div>
      <Toast
        message={"Successfully Deleted Row!"}
        isOpen={toastOpen}
        onClose={() => setToastOpen(false)}
      />
    </>
  );
};

export const loader: LoaderFunction = (args) => {
  return remixAppLoader(args, searchExpenses);
};

export const action: ActionFunction = (args) => {
  return remixAppAction(args, ({ data }) =>
    deleteExpenseRecord({ data }).then(() => redirect(`/user/expenses`))
  );
};

export const ErrorBoundary = DefaultErrorBoundary;

export const CatchBoundary = DefaultCatchBoundary;

export default UserExpensesPage;
