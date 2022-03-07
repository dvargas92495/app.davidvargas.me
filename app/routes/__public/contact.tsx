import React from "react";
import getMeta from "@dvargas92495/ui/utils/getMeta";
import Contact from "@dvargas92495/ui/components/Contact";

const ContactPage: React.FunctionComponent = () => (
  <Contact email={"dvargas92495@gmail.com"} />
);

export const meta = getMeta({ title: "Contact Us" });

export default ContactPage;
