import React from "react";
import getMeta from "~/package/utils/getMeta";
import PrivacyPolicy from "~/package/components/PrivacyPolicy";

const PrivacyPolicyPage: React.FunctionComponent = () => (
  <PrivacyPolicy name={"App"} domain={"app.davidvargas.me"} />
);

export const Head = getMeta({ title: "Privacy Policy" });

export default PrivacyPolicyPage;
