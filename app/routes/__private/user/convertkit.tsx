import React from "react";
import {
  ActionFunction,
  Form,
  LoaderFunction,
  useCatch,
  useLoaderData,
} from "remix";
import Button from "~/components/Button";
import TextInput from "~/components/TextInput";
import remixAppAction from "@dvargas92495/ui/utils/remixAppAction.server";
import remixAppLoader from "@dvargas92495/ui/utils/remixAppLoader.server";
import getConvertKitBroadcasts from "~/data/getConvertKitBroadcasts.server";
import createConvertKitBroadcast from "~/data/createConvertKitBroadcast.server";
import DefaultErrorBoundary from "~/components/DefaultErrorBoundary";
import { CatchBoundaryComponent } from "@remix-run/server-runtime/routeModules";

const UserConvertKit = () => {
  const data =
    useLoaderData<Awaited<ReturnType<typeof getConvertKitBroadcasts>>>();
  return (
    <>
      <Form method={"post"} className="mb-6">
        <TextInput
          label={"Since"}
          name={"since"}
          defaultValue={data.broadcasts[0].created_at}
        />
        <Button>Create Broadcast</Button>
      </Form>
      <div>
        <h1 className="text-2xl font-bold mb-6">Latest Broadcasts</h1>
        <ul>
          {data.broadcasts.map((b) => (
            <li key={b.id}>
              {b.subject} ({b.created_at})
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export const loader: LoaderFunction = (args) => {
  return remixAppLoader(args, ({ userId }) => getConvertKitBroadcasts(userId));
};

export const action: ActionFunction = (args) => {
  return remixAppAction(args, ({ userId, data }) => {
    return createConvertKitBroadcast({
      userId,
      since: new Date(Date.parse(data.since?.[0] as string)),
    }).catch((e) => {
      if (e.response) {
        throw new Response(e.response.data, { status: e.response.status });
      } else {
        throw new Response(`Internal Server Error: ${e.message}`, {
          status: 500,
        });
      }
    });
  });
};

export const ErrorBoundary = DefaultErrorBoundary;

export const CatchBoundary: CatchBoundaryComponent = () => {
  const caught = useCatch();
  return <DefaultErrorBoundary error={new Error(caught.data)} />;
};

export default UserConvertKit;
