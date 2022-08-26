import { ActionFunction } from "@remix-run/node";
import type { Params } from "react-router";
import getUserId from "./getUserId.server";
import handleAsResponse from "./handleAsResponse.server";
import parseRemixContext from "./parseRemixContext.server";
import { NotFoundResponse } from "./responses.server";

type ActionMethod = "POST" | "PUT" | "DELETE";

type CallbackArgs = {
  userId: string;
  data: Record<string, string[]>;
  params: Params<string>;
  searchParams: Record<string, string>;
  context: { requestId: string };
};

export type RemixAppActionCallback =
  | ((
      args: CallbackArgs & {
        method: ActionMethod;
      }
    ) => ReturnType<ActionFunction>)
  | {
      [k in ActionMethod]?: (args: CallbackArgs) => ReturnType<ActionFunction>;
    };

const remixAppAction = (
  { request, params, context: remixContext }: Parameters<ActionFunction>[0],
  callback?: RemixAppActionCallback
) => {
  const output = getUserId(request).then(async (userId) => {
    if (!userId) {
      throw new Response("Cannot access private page while not authenticated", {
        status: 401,
      });
    }
    if (!callback) return {};
    const searchParams = Object.fromEntries(new URL(request.url).searchParams);
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
    const context = {
      requestId: parseRemixContext(remixContext).lambdaContext.awsRequestId,
    };
    const method = request.method as ActionMethod;
    if (typeof callback === "function") {
      const response = callback({
        userId,
        data,
        method: request.method as ActionMethod,
        searchParams,
        params,
        context,
      });
      return handleAsResponse(response, "Unknown Application Action Error");
    }
    const methodCallback = callback[method];
    if (methodCallback) {
      const response = methodCallback({
        userId,
        data,
        searchParams,
        params,
        context,
      });
      return handleAsResponse(response, `Unknown Application ${method} Error`);
    } else {
      throw new NotFoundResponse(`Unsupported method ${method}`);
    }
  });
  return handleAsResponse(
    output,
    "Something went wrong while parsing the app callback"
  );
};

export default remixAppAction;
