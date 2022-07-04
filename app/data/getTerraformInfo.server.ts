import { users } from "@clerk/clerk-sdk-node";

const getTerraformInfo = ({ userId }: { userId: string }) =>
  users
    .getUser(userId)
    .then(
      (u) =>
        u.publicMetadata.Terraform as
          | { organization?: string; organizationApiToken?: string }
          | undefined
    );

export default getTerraformInfo;
