import {
  Form,
  useLoaderData,
  useParams,
  useSearchParams,
} from "@remix-run/react";
import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import insertEventFromSource from "~/data/insertEventFromSource.server";
import remixAppAction from "~/package/backend/remixAppAction.server";
import Button from "~/package/components/Button";
export { default as CatchBoundary } from "~/package/components/DefaultCatchBoundary";
export { default as ErrorBoundary } from "~/package/components/DefaultErrorBoundary";
import TextInput from "~/package/components/TextInput";
import remixAppLoader from "~/package/backend/remixAppLoader.server";
import getSourceTransaction from "~/data/getSourceTransaction.server";
import AutoCompleteInput from "~/package/components/AutoCompleteInput";
import CODES from "~/enums/taxCodes";

const UserSourceEvent = () => {
  const recordSelected =
    useLoaderData<Awaited<ReturnType<typeof getSourceTransaction>>>();
  const [searchParams] = useSearchParams();
  const { id, source } = useParams();
  const search = `${searchParams.toString() && `?${searchParams.toString()}`}`;
  return (
    <Form method="put" key={recordSelected.id} action={`/user/sources/${source}/${id}${search}`}>
      <TextInput
        label={"Date"}
        name={"date"}
        defaultValue={recordSelected.date}
      />
      <AutoCompleteInput
        label={"Code"}
        name={"code"}
        options={CODES}
        defaultValue={recordSelected.code}
      />
      <TextInput
        label={"Description"}
        name={"description"}
        defaultValue={recordSelected.description}
      />
      <TextInput
        label={"Amount"}
        name={"amount"}
        defaultValue={recordSelected.amount}
      />
      <div className="flex gap-8 items-center">
        <Button>Save</Button>
        {!recordSelected.found && (
          <span className="inline-block rounded-xl bg-orange-300 px-4 py-2 font-bold">
            WARNING: No Rule Found
          </span>
        )}
      </div>
    </Form>
  );
};

export const action: ActionFunction = (args) => {
  return remixAppAction(args, {
    PUT: ({ data, params, searchParams }) =>
      insertEventFromSource({ data, params }).then(() =>
        redirect(
          `/user/sources${
            Object.keys(searchParams).length > 0
              ? `?${new URLSearchParams(searchParams).toString()}`
              : ""
          }`
        )
      ),
  });
};

export const loader: LoaderFunction = (args) => {
  return remixAppLoader(args, getSourceTransaction);
};

export default UserSourceEvent;
