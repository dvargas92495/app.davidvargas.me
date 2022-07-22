import React from "react";
import { SignIn } from "@clerk/remix";
import remixAuthedLoader from "../backend/remixAuthedLoader.server";
import getMeta from "../utils/getMeta";
import { Form } from "@remix-run/react";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
export { default as CatchBoundary } from "../components/DefaultCatchBoundary";
export { default as ErrorBoundary } from "../components/DefaultErrorBoundary";
import { ActionFunction, redirect } from "@remix-run/node";
import {
  MethodNotAllowedResponse,
  NotFoundResponse,
} from "../backend/responses.server";
import { offlinePrefs } from "../backend/cookies.server";

const LoginPage: React.FC = () => {
  return (
    <>
      <SignIn path="/login" />
      {process.env.NODE_ENV === "development" && (
        <Form method={"post"}>
          <TextInput name={"user"} label={"User ID"} />
          <Button>Offline Log In</Button>
        </Form>
      )}
    </>
  );
};

export const loader = remixAuthedLoader;
export const action: ActionFunction = async ({ request }) => {
  if (request.method === "POST") {
    if (process.env.NODE_ENV === "development") {
      const cookieHeader = request.headers.get("Cookie");
      const cookie = (await offlinePrefs.parse(cookieHeader)) || {};
      const bodyParams = await request.formData();
      cookie.userId = bodyParams.get("user");
      return redirect("/", {
        headers: {
          "Set-Cookie": await offlinePrefs.serialize(cookie),
        },
      });
    } else {
      throw new MethodNotAllowedResponse(
        `This method is only allowed during development`
      );
    }
  } else {
    throw new NotFoundResponse(`Unsupported method ${request.method}`);
  }
};
export const meta = getMeta({ title: "Log in" });
export default LoginPage;
