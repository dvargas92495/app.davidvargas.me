import React from "react";
import { SignIn } from "@clerk/remix";
import remixAuthedLoader from "~/package/utils/remixAuthedLoader.server";
import getMeta from "~/package/utils/getMeta";

const LoginPage: React.FC = () => <SignIn path="/login" />;

export const loader = remixAuthedLoader;
export const meta = getMeta({ title: "Log in" });
export default LoginPage;
