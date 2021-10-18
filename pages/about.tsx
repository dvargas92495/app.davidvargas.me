import React from "react";
import Layout, { LayoutHead } from "./_common/Layout";
import About from "@dvargas92495/ui/dist/components/About";

const AboutPage: React.FunctionComponent = () => (
  <Layout>
    <About
      title={"Vargas Arts"}
      subtitle={"A portfolio of open source SaaS applications"}
      paragraphs={[
        "This website is just a shell for testing portfolio wide upgrades. It is not intended to be used by actual users in any capacity.",
      ]}
    />
  </Layout>
);

export const Head = (): React.ReactElement => <LayoutHead title={"About"} />;
export default AboutPage;
