import { ActionFunction } from "@remix-run/server-runtime";
import type { Params } from "react-router";

type ActionMethod = "POST" | "PUT" | "DELETE";

const remixAppAction = (
  { request, params }: Parameters<ActionFunction>[0],
  callback?: (args: {
    userId: string;
    data: Record<string, string[]>;
    method: ActionMethod;
    params: Params<string>;
    searchParams: Record<string, string>;
  }) => ReturnType<ActionFunction>
) => {
  return import("@clerk/remix/ssr.server.js")
    .then((clerk) => clerk.getAuth(request))
    .then(async ({ userId }) => {
      if (!userId) {
        throw new Response(
          "Cannot access private page while not authenticated",
          { status: 401 }
        );
      }
      if (!callback) return {};
      const searchParams = Object.fromEntries(
        new URL(request.url).searchParams
      );
      const data = await request
        .formData()
        .then((formData) =>
          Object.fromEntries(
            Array.from(formData.keys()).map((k) => [
              k,
              formData.getAll(k).map((v) => v as string),
            ])
          )
        )
        .catch(() => ({}));
      const response = callback({
        userId,
        data,
        method: request.method as ActionMethod,
        searchParams,
        params,
      });
      return Promise.resolve(response).catch((e) => {
        throw new Response(e.message, { status: e.code || 500 });
      });
    })
    .catch((e) => {
      if (e instanceof Response) throw e;
      else
        throw new Response(
          `Something went wrong while parsing the app callback:\n${e.message}`,
          { status: 500 }
        );
    });
};

export default remixAppAction;
