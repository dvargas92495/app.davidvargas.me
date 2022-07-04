import { users } from "@clerk/clerk-sdk-node";

const saveTerraformInfo = ({
  userId,
  data,
}: {
  userId: string;
  data: Record<string, string[]>;
}) =>
  users.getUser(userId).then((u) =>
    users.updateUser(userId, {
      publicMetadata: {
        ...u.publicMetadata,
        Terraform: {
          ...(typeof u.publicMetadata.Terraform === "object"
            ? u.publicMetadata.Terraform
            : {}),
          ...Object.fromEntries(
            Object.entries(data).map(([k, v]) => [k, v[0]])
          ),
        },
      },
    })
  );
export default saveTerraformInfo;
