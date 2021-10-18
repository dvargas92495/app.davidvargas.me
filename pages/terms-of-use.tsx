import React from "react";
import Layout, { LayoutHead } from "./_common/Layout";
import TermsOfUse from "@dvargas92495/ui/dist/components/TermsOfUse";

const TermsOfUsePage: React.FunctionComponent = () => (
  <Layout>
    <TermsOfUse name={"App"} domain={"app.davidvargas.me"} />
  </Layout>
);

export const Head = (): React.ReactElement => (
  <LayoutHead title={"Terms of Use"} />
);
export default TermsOfUsePage;
