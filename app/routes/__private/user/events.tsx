import { useMemo } from "react";
import Table from "~/package/components/Table";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import remixAppLoader from "~/package/backend/remixAppLoader.server";
import searchEvents from "~/data/searchEvents.server";
import {
  Form,
  Link,
  Outlet,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import Select from "~/package/components/Select";
import TextInput from "~/package/components/TextInput";
import Button from "~/package/components/Button";
export { default as ErrorBoundary } from "~/package/components/DefaultErrorBoundary";
export { default as CatchBoundary } from "~/package/components/DefaultCatchBoundary";
import remixAppAction from "~/package/backend/remixAppAction.server";
import updateEventDescriptions from "~/data/updateEventDescriptions.server";
import SuccessfulActionToast from "~/package/components/SuccessfulActionToast";

const UserEventPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultDescription = (searchParams.get("description") as string) || "";
  const defaultSource = (searchParams.get("source") as string) || "";
  const paramString = useMemo(() => {
    const sp = searchParams.toString();
    return sp ? `?${sp}` : "";
  }, [searchParams]);
  return (
    <div className="flex gap-8">
      <div className="max-w-5xl w-full">
        <div className="mb-2 flex gap-4 items-center">
          <Form className="flex gap-4 items-center">
            <Select
              label={"Source"}
              name={"source"}
              defaultValue={defaultSource}
              options={["ethereum", "stripe", "mercury"]}
            />
            <TextInput
              label={"Description"}
              name={"description"}
              defaultValue={defaultDescription}
              required={false}
            />
            <Button>Search</Button>
          </Form>
          <Form method="put" className="flex gap-4 items-center">
            <TextInput label={"Description"} name={"newDescription"} />
            <Button>Migrate</Button>
          </Form>
        </div>
        <Table
          onRowClick={(row) =>
            navigate(`/user/events/${row.uuid}${paramString}`)
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
  return remixAppLoader(args, searchEvents);
};

export const action: ActionFunction = (args) => {
  return remixAppAction(args, { PUT: updateEventDescriptions });
};

export default UserEventPage;
