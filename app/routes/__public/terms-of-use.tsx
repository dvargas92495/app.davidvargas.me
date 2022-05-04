import React from "react";
import getMeta from "~/package/utils/getMeta";
import TermsOfUse from "~/package/components/TermsOfUse";

const TermsOfUsePage: React.FC = () => (
  <TermsOfUse name={"App"} domain={"app.davidvargas.me"} />
);

export const meta = getMeta({ title: "Terms of Use" });
export default TermsOfUsePage;
