import axios from "axios";

type Workspaces = { data: { id: string; attributes: { name: string } }[] };
type Vars = { data: { id: string; attributes: { key: string } }[] };

const listTerraformWorkspaces = ({
  userId,
}: {
  userId:
    | string
    | {
        opts: {
          headers: {
            Authorization: string;
            "Content-Type": string;
          };
        };
        org: string;
      };
}) => {
  return (
    typeof userId === "string"
      ? import("@clerk/clerk-sdk-node")
          .then((clerk) => clerk.users.getUser(userId))
          .then(async (user) => {
            const account = user.publicMetadata.Terraform as {
              username: string;
              organization: string;
              organizationApiToken: string;
            };
            if (!account) {
              throw new Response(
                `User has not yet connected their Etherscan account`,
                {
                  status: 403,
                }
              );
            }
            return {
              opts: {
                headers: {
                  Authorization: `Bearer ${account.organizationApiToken}`,
                  "Content-Type": "application/vnd.api+json",
                },
              },
              org: account.organization,
            };
          })
      : Promise.resolve(userId)
  ).then(({ opts, org }) => {
    const getWorkspaces = (page = 1): Promise<Workspaces["data"]> =>
      axios
        .get<Workspaces>(
          `https://app.terraform.io/api/v2/organizations/${encodeURIComponent(
            org
          )}/workspaces?page[number]=${page}`,
          opts
        )
        .then((r) =>
          r.data.data.length === 20
            ? getWorkspaces(page + 1).then((n) => [...r.data.data, ...n])
            : r.data.data
        );
    return getWorkspaces().then(async (ws) => {
      return {
        workspaces: await Promise.all(
          ws.map((w) =>
            axios
              .get<Vars>(
                `https://app.terraform.io/api/v2/workspaces/${w.id}/vars`,
                opts
              )
              .then((r) => ({
                vars: r.data.data.map((k) => ({
                  id: k.id,
                  name: k.attributes.key,
                })),
                id: w.id,
                name: w.attributes.name,
              }))
          )
        ),
      };
    });
  });
};

export default listTerraformWorkspaces;
