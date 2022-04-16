import React from "react";
import { ActionFunction } from "remix";
import remixAppAction from "@dvargas92495/ui/utils/remixAppAction.server";
import CustomConnectedAccount from "~/components/CustomConnectedAccount";
import { UserProfile } from "@clerk/clerk-react";

const UserIndex = () => {
  return (
    <div className="border-dashed border-r-4 border-gray-400 border-4 text-center py-8">
      <UserProfile />
      <CustomConnectedAccount
        svgSrc="https://cdn.convertkit.com/assets/favicon-4843235c06c5056599309bc40ded6ee7d318ef73f103fbc70113db8fefc534d3.ico"
        name={"ConvertKit"}
        fields={["API Secret"]}
      />
      <CustomConnectedAccount
        svgSrc="https://etherscan.io/images/favicon3.ico"
        name={"Etherscan"}
        fields={["API Key Token", "Address"]}
      />
      <CustomConnectedAccount
        svgSrc="https://infura.io/favicon/favicon-32x32.png"
        name={"Infura"}
        fields={["Id"]}
      />
    </div>
  );
};

export const action: ActionFunction = (args) => {
  return remixAppAction(args, ({ userId, data, method }) =>
    import("@clerk/clerk-sdk-node").then((c) =>
      c.users.getUser(userId).then((u) => {
        if (method === "PUT") {
          const account = data.account?.[0];
          if (account) {
            return c.users
              .updateUser(userId, {
                publicMetadata: {
                  ...u.publicMetadata,
                  [account]: Object.fromEntries(
                    Object.entries(data)
                      .filter(([k]) => k !== "account")
                      .map(([k, [v]]) => [k, v])
                  ),
                },
              })
              .then(() => ({ success: true }));
          }
          throw new Response("Missing account field", { status: 400 });
        }
        throw new Response(`Unsupported method ${method}`, { status: 404 });
      })
    )
  );
};

export default UserIndex;
