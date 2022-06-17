import React, { useMemo, useState } from "react";
import Table from "~/package/components/Table";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import remixAppLoader from "~/package/backend/remixAppLoader.server";
import searchRevenue from "~/data/searchRevenue.server";
import {
  Form,
  Link,
  Outlet,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import TextInput from "~/package/components/TextInput";
import Button from "~/package/components/Button";
import DefaultErrorBoundary from "~/package/components/DefaultErrorBoundary";
import DefaultCatchBoundary from "~/package/components/DefaultCatchBoundary";
import remixAppAction from "~/package/backend/remixAppAction.server";
import updateRevenueProducts from "~/data/updateRevenueProducts.server";
import SuccessfulActionToast from "~/package/components/SuccessfulActionToast";

const UserRevenuePage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultProduct = (searchParams.get("product") as string) || "";
  const paramString = useMemo(() => {
    const sp = searchParams.toString();
    return sp ? `?${sp}` : "";
  }, [searchParams]);
  const [product, setProduct] = useState(defaultProduct);
  return (
    <div className="flex gap-8">
      <div className="max-w-3xl w-full">
        <div className="mb-2 flex gap-4 items-center">
          <TextInput
            label={"Product"}
            name={"product"}
            defaultValue={defaultProduct}
            onChange={(e) => setProduct(e.target.value)}
          />
          <Button
            onClick={() =>
              setSearchParams({ ...Object.fromEntries(searchParams), product })
            }
          >
            Search
          </Button>
          <Form method="put" className="flex gap-4 items-center ml-4">
            <input name={"product"} defaultValue={product} type={"hidden"} />
            <TextInput label={"Product"} name={"newProduct"} />
            <Button>Migrate</Button>
          </Form>
        </div>
        <Table
          onRowClick={(row) =>
            navigate(`/user/revenue/${row.uuid}${paramString}`)
          }
        />
      </div>
      <div className="relative flex-grow">
        <Outlet />
      </div>
      <SuccessfulActionToast />
    </div>
  );
};

export const loader: LoaderFunction = (args) => {
  return remixAppLoader(args, searchRevenue);
};

export const action: ActionFunction = (args) => {
  return remixAppAction(args, updateRevenueProducts);
};

export const ErrorBoundary = DefaultErrorBoundary;
export const CatchBoundary = DefaultCatchBoundary;

export default UserRevenuePage;
