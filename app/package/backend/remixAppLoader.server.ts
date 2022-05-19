import { LoaderFunction, redirect } from "@remix-run/server-runtime";
import type { Params } from "react-router";

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
      return Promise.resolve(response).catch((e) => {
        if (e instanceof Response) throw e;
        throw new Response(e.message, { status: e.status || 500 });
      });
    });
};

export default remixAppLoader;
