import PublicPage from "~/package/components/PublicLayout";
import type { LoaderFunction } from "@remix-run/node";
import getUserId from "~/package/backend/getUserId.server";

export const loader: LoaderFunction = ({ request }) => {
  return getUserId(request).then((id) => !!id);
};

export default () => <PublicPage pages={["revenue", "components"]} />;
