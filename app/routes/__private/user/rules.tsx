import { useMemo } from "react";
import Table from "~/package/components/Table";
import type { LoaderFunction } from "@remix-run/node";
import remixAppLoader from "~/package/backend/remixAppLoader.server";
import searchRules from "~/data/searchRules.server";
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
import SuccessfulActionToast from "~/package/components/SuccessfulActionToast";

const UserRulesPage = () => {
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
          <Link to={"/user/rules/new"}>New</Link>
        </div>
        <Table
          onRowClick={(row) =>
            navigate(`/user/rules/${row.uuid}${paramString}`)
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
  return remixAppLoader(args, searchRules);
};

export default UserRulesPage;
