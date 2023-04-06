import React from "react";
import { DataFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

const OauthConnectionPage = (): React.ReactElement => {
  const data = useLoaderData<Awaited<ReturnType<typeof loadData>>>();
  return data.success ? (
    <div>
      <h1 className="text-3xl font-bold mb-2">Success!</h1>
      <div className="mb-2">You can close this window.</div>
    </div>
  ) : (
    <div>
      <div>Something went wrong. Please try again.</div>
      <div className="text-red-800 bg-red-200 border border-red-800 rounded-md">
        Error: <code>{JSON.stringify(data.data)}</code>
      </div>
    </div>
  );
};

const loadData = async ({
  searchParams,
  params,
}: {
  searchParams: Record<string, string>;
  params: Record<string, string | undefined>;
}) => {
  const { id = "" } = params;
  const { code, state, error, ...customParams } = searchParams;

  return fetch(`${process.env.API_URL}/extensions/${id}/oauth`, {
    method: "post",
    body: JSON.stringify({
      code,
      state,
      customParams,
    }),
  })
    .then(() => ({
      data: {},
      success: true as const,
    }))
    .catch((e) => ({ data: e.response.data, success: false as const }));
};

export const loader = async ({ request, params }: DataFunctionArgs) => {
  const searchParams = Object.fromEntries(new URL(request.url).searchParams);

  return loadData({ params, searchParams });
};

export default OauthConnectionPage;
