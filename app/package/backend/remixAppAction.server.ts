import { ActionFunction } from "@remix-run/node";
import type { Params } from "react-router";

type ActionMethod = "POST" | "PUT" | "DELETE";

type CallbackArgs = {
  userId: string;
  data: Record<string, string[]>;
  params: Params<string>;
  searchParams: Record<string, string>;
};

const remixAppAction = (
  { request, params }: Parameters<ActionFunction>[0],
  callback?:
    | ((
        args: CallbackArgs & {
          method: ActionMethod;
        }
      ) => ReturnType<ActionFunction>)
    | Record<ActionMethod, (args: CallbackArgs) => ReturnType<ActionFunction>>
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
      const method = request.method as ActionMethod;
      if (typeof callback === "function") {
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
      } else if (callback[method]) {
        const response = callback[method]({
          userId,
          data,
          searchParams,
          params,
        });
        return Promise.resolve(response).catch((e) => {
          throw new Response(e.message, { status: e.code || 500 });
        });
      } else {
        throw new Response(`Unsupported method ${method}`, { status: 404 });
      }
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
