import axios from "axios";
import listTerraformWorkspaces from "./listTerraformWorkspaces.server";

const editTerraformVariable = ({
  userId,
  key = "NULL",
  value,
}: {
  value?: string;
  key?: string;
  userId: string;
}) => {
  return import("@clerk/clerk-sdk-node")
    .then((clerk) => clerk.users.getUser(userId))
    .then(async (user) => {
      const account = user.publicMetadata.Terraform as {
        username: string;
        organization: string;
        organizationApiToken: string;
      };
      if (!account) {
        throw new Response(
          `User has not yet connected their Terraform account`,
          {
            status: 403,
          }
        );
      }
      const opts = {
        headers: {
          Authorization: `Bearer ${
            account.organizationApiToken ||
            process.env.TERRAFORM_ORGANIZATION_TOKEN
          }`,
          "Content-Type": "application/vnd.api+json",
        },
      };
      return listTerraformWorkspaces({
        userId: { opts, org: account.organization },
      })
        .then(({ workspaces }) =>
          Promise.all(
            workspaces
              .map((w) => ({
                ...w,
                vars: w.vars.filter((v) => new RegExp(key).test(v.name)),
              }))
              .filter((w) => w.vars.length)
              .flatMap((w) =>
                w.vars.map((v) => ({ workspaceId: w.id, variableId: v.id }))
              )
              .map((v) =>
                axios.patch(
                  `https://app.terraform.io/api/v2/workspaces/${v.workspaceId}/vars/${v.variableId}`,
                  {
                    data: {
                      type: "vars",
                      id: v.variableId,
                      attributes: {
                        value,
                      },
                    },
                  },
                  opts
                )
              )
          )
        )
        .then((l) => ({
          success: true,
          message: `Successfully updated ${l.length} workspaces!`,
        }));
    });
};

export default editTerraformVariable;
