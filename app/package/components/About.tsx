import React from "react";
import ExternalLink from "./ExternalLink";
import Subtitle from "./Subtitle";
import Title from "./Title";

const About = ({
  title,
  subtitle,
  paragraphs,
}: {
  title: string;
  subtitle: string;
  paragraphs: React.ReactNode[];
}) => (
  <div
    style={{
      maxWidth: "800px",
      width: "100%",
    }}
  >
    <Title className="font-bold text-3xl mb-2">{title}</Title>
    <Subtitle className="font-semibold mb-2">{subtitle}</Subtitle>
    {paragraphs.map((p, i) => (
      <p key={i} className={"mb-2 whitespace-pre-wrap"}>
        {p}
      </p>
    ))}
    <hr className={"mb-8"} />
    <p>
      <img
        src="https://pbs.twimg.com/profile_images/1272885092545896450/VaEFChlf_400x400.jpg"
        className="rounded-full w-40 inline-grid mr-4 float-left"
      />
      <span className="font-semibold">{title}</span> is part of the Vargas Arts
      portfolio of projects. Check out some of my other projects at{" "}
      <ExternalLink href={"https://davidvargas.me/projects"}>
        https://davidvargas.me/projects
      </ExternalLink>
      !
    </p>
  </div>
);

export default About;
