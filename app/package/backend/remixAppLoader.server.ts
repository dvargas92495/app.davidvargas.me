import { LoaderFunction, redirect } from "@remix-run/node";
import type { Params } from "react-router";
import handleAsResponse from "./handleAsResponse.server";

const remixAppLoader = (
  { request, params }: Parameters<LoaderFunction>[0],
  callback?: (args: {
    userId: string;
    params: Params<string>;
    searchParams: Record<string, string>;
  }) => ReturnType<LoaderFunction>
) => {
  return import("@clerk/remix/ssr.server.js")
    .then((clerk) => clerk.getAuth(request))
    .then((authData) => {
      if (!authData.userId) {
        return redirect("/login");
      }
      const searchParams = Object.fromEntries(
        new URL(request.url).searchParams
      );
      const response = callback
        ? callback({ userId: authData.userId, params, searchParams })
        : {};
      return handleAsResponse(response, "Unknown Application Loader Error");
    });
};

export default remixAppLoader;
