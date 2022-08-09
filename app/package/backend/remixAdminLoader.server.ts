import { users } from "@clerk/clerk-sdk-node";
import { LoaderFunction, redirect } from "@remix-run/node";
import { Params } from "@remix-run/react";
import { domain } from "./constants.server";
import remixAppLoader from "./remixAppLoader.server";

const remixAdminLoader = (
  args: Parameters<LoaderFunction>[0],
  callback?: (args: {
    userId: string;
    params: Params<string>;
    searchParams: Record<string, string>;
  }) => ReturnType<LoaderFunction>
) => {
  return remixAppLoader(args, (data) =>
    users.getUser(data.userId).then((user) => {
      const isAdmin = user.emailAddresses.find((u) =>
        u.emailAddress?.endsWith(domain)
      );
      if (!isAdmin) {
        return redirect("/user");
      }
      return callback?.(data) || {};
    })
  );
};

export default remixAdminLoader;
