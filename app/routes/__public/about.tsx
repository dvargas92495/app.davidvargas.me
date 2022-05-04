import React from "react";
import getMeta from "~/package/utils/getMeta";
import About from "~/package/components/About";

const AboutPage: React.FunctionComponent = () => (
  <About title={"About"} subtitle={"Description"} paragraphs={[]} />
);

export const meta = getMeta({ title: "About" });

export default AboutPage;
