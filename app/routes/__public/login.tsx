import React from "react";
import { SignIn } from "@clerk/remix";
import getRootAuthedLoader from "@dvargas92495/ui/utils/getRootAuthedLoader";
import getMeta from "@dvargas92495/ui/utils/getMeta";

const LoginPage: React.FC = () => (
  <SignIn path="/login" />
);

export const loader = getRootAuthedLoader();
export const meta = getMeta({ title: "Log in" });
export default LoginPage;
