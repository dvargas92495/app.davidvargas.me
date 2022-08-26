import { LoaderFunction, redirect } from "@remix-run/node";
import type { Params } from "react-router";
import handleAsResponse from "./handleAsResponse.server";
import getUserId from "./getUserId.server";

const remixAppLoader = (
  { request, params, context: remixContext }: Parameters<LoaderFunction>[0],
  callback?: (args: {
    userId: string;
    params: Params<string>;
    searchParams: Record<string, string>;
    context: { requestId: string };
  }) => ReturnType<LoaderFunction>
) => {
  return getUserId(request).then((userId) => {
    if (!userId) {
      return redirect("/login");
    }
    const searchParams = Object.fromEntries(new URL(request.url).searchParams);
    const context = {
      requestId: (remixContext.lambdaContext as Record<string, string>)
        .requestId,
    };
    const response = callback
      ? callback({ userId, params, searchParams, context })
      : {};
    return handleAsResponse(response, "Unknown Application Loader Error");
  });
};

export default remixAppLoader;
