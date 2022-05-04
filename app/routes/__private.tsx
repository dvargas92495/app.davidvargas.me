import remixAppLoader from "~/package/backend/remixAppLoader.server";
import { Outlet } from "@remix-run/react";

export const loader = remixAppLoader;
export default Outlet;
