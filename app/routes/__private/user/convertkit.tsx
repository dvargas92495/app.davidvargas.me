import React from "react";
import { ActionFunction, Form, LoaderFunction, useLoaderData } from "remix";
import Button from "~/components/Button";
import TextInput from "~/components/TextInput";
import remixAppAction from "@dvargas92495/ui/utils/remixAppAction.server";
import remixAppLoader from "@dvargas92495/ui/utils/remixAppLoader.server";
import getConvertKitBroadcasts from "~/data/getConvertKitBroadcasts.server";
import createConvertKitBroadcast from "~/data/createConvertKitBroadcast.server";

const UserConvertKit = () => {
  const data =
    useLoaderData<Awaited<ReturnType<typeof getConvertKitBroadcasts>>>();
  return (
    <>
      <Form method={"post"} className="mb-6">
        <TextInput label={"Since"} name={"since"} />
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
    });
  });
};

export default UserConvertKit;
