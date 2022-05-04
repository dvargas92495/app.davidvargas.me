import React from "react";
import getMeta from "~/package/utils/getMeta";
import Contact from "~/package/components/Contact";

const ContactPage: React.FunctionComponent = () => (
  <Contact email={"dvargas92495@gmail.com"} />
);

export const meta = getMeta({ title: "Contact Us" });

export default ContactPage;
