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
import getEtherscan from "~/data/getEtherscan.server";
import { useMemo } from "react";
import fixRecordFromEtherscan from "~/data/fixRecordFromEtherscan.server";
import NumberInput from "~/package/components/NumberInput";

const EtherscanRecord = () => {
  const recordSelected =
    useOutletContext<
      Awaited<ReturnType<typeof listEtherscanRecords>>["data"][number]
    >();
  const data = useLoaderData<Awaited<ReturnType<typeof getEtherscan>>>();
  const defaultCategory = useMemo(() => {
    return data.correctRevenue.length || data.incorrectRevenue.length
      ? "revenue"
      : data.correctExpense.length || data.incorrectExpense.length
      ? "expense"
      : data.correctPersonal.length || data.incorrectPersonal.length
      ? "personal"
      : "revenue";
  }, [data, recordSelected]);
  const defaultAmount = useMemo(() => {
    return data.amount || recordSelected?.value;
  }, [data, recordSelected]);
  const defaultDescription = useMemo(() => {
    return data.description || "";
  }, [data, recordSelected]);
  return (
    <div className="flex gap-8">
      <Form method="post" className="mt-4 flex gap-2">
        <div>
          <input
            name={"hash"}
            defaultValue={recordSelected?.hash}
            type={"hidden"}
          />
          <NumberInput
            name={"index"}
            defaultValue={recordSelected?.index}
            disabled
          />
          <TextInput
            name={"date"}
            defaultValue={recordSelected?.date}
            label={"Date"}
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
            label={"Original Value"}
            name={"value"}
            defaultValue={recordSelected?.value}
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
        </div>
        <div>
          <TextInput
            label={"Category"}
            name={"category"}
            defaultValue={defaultCategory}
          />
          <TextInput
            label={"Description"}
            name={"description"}
            defaultValue={defaultDescription}
          />
          <TextInput
            label={"Amount"}
            name={"amount"}
            defaultValue={defaultAmount}
          />
          <Button>Save</Button>
        </div>
        <pre className="border-yellow-900 border text-yellow-900 bg-yellow-200 p-4">
          {JSON.stringify(data, null, 4)}
        </pre>
      </Form>
      <Form method="put" className="mt-4">
        <input
          type={"hidden"}
          name={"date"}
          defaultValue={recordSelected?.date}
        />
        <input
          type={"hidden"}
          name={"from"}
          defaultValue={recordSelected?.from}
        />
        <input type={"hidden"} name={"to"} defaultValue={recordSelected?.to} />
        <input
          type={"hidden"}
          name={"value"}
          defaultValue={recordSelected?.value}
        />
        <input
          type={"hidden"}
          name={"gas"}
          defaultValue={recordSelected?.gas}
        />
        <input
          type={"hidden"}
          name={"type"}
          defaultValue={recordSelected?.type}
        />
        <Button>Fix</Button>
      </Form>
    </div>
  );
};

export const action: ActionFunction = (args) => {
  return remixAppAction(args, ({ userId, data, method, params }) => {
    if (method === "POST")
      return insertRecordFromEtherscan({ userId, data })
        .then(() => redirect("/user/etherscan"))
        .catch((e) => {
          throw new Response(e.message, { status: 500 });
        });
    else if (method === "PUT")
      return fixRecordFromEtherscan({ userId, params })
        .then(() => redirect("/user/etherscan"))
        .catch((e) => {
          throw new Response(e.message, { status: 500 });
        });
    else throw new Response(`Method ${method} Not Found`, { status: 404 });
  });
};

export const loader: LoaderFunction = (args) => {
  return remixAppLoader(args, getEtherscan);
};

export const ErrorBoundary = DefaultErrorBoundary;
export const CatchBoundary = DefaultCatchBoundary;

export default EtherscanRecord;
