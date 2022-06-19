import React, { SVGAttributes } from "react";
import { Form, Link } from "@remix-run/react";
import Subtitle from "./Subtitle";
import TextInput from "./TextInput";
import Title from "./Title";
import Button from "./Button";
import SuccessfulActionToast from "./SuccessfulActionToast";

export const Splash = ({
  Logo = ({className}) => <img className={className} src={"/images/logo.png"}/>,
  title,
  subtitle,
  isWaitlist,
  primaryHref,
  secondaryHref,
}: {
  Logo?: React.FunctionComponent<{ className?: string }>;
  title: string;
  subtitle: string;
  isWaitlist?: boolean;
  primaryHref?: string;
  secondaryHref?: string;
}) => {
  return (
    <div className={"flex items-center gap-24"}>
      <div className={"w-1/2"}>
        <h1 className="mt-4 mb-12 text-5xl font-bold">{title}</h1>
        <Subtitle>
          <i className="font-normal">{subtitle}</i>
        </Subtitle>
        {isWaitlist && (
          <Form className="flex gap-8 items-center">
            <TextInput
              placeholder="hello@example.com"
              name={"email"}
              label={"Email"}
              className={"flex-grow"}
            />
            <Button>Get On The Waitlist</Button>
          </Form>
        )}
        <div className="flex gap-8">
          {primaryHref && (
            <Link
              to={`/${primaryHref}`}
              className={
                "py-3 px-6 bg-sky-500 font-medium uppercase shadow-sm hover:shadow-md hover:bg-sky-700 active:shadow-none active:bg-sky-900 rounded-md"
              }
            >
              <span>Getting Started</span>
            </Link>
          )}
          {secondaryHref && (
            <Link
              to={`/${secondaryHref}`}
              className={
                "py-3 px-6 text-sky-500 border border-sky-500 rounded-md font-medium uppercase box-border hover:text-sky-700 hover:border-sky-700 active:bg-sky-900 active:bg-opacity-25"
              }
            >
              <span>Explore</span>
            </Link>
          )}
        </div>
      </div>
      <div className="flex-grow text-center">
        <Logo className="h-full w-full" />
      </div>
      <SuccessfulActionToast message="Successfully entered our waitlist!" />
    </div>
  );
};

export const Showcase = ({
  header,
  showCards,
}: {
  header: string;
  showCards: { title: string; description?: React.ReactNode; image?: string }[];
}) => {
  return (
    <>
      <div className="text-center mb-2">
        <Subtitle>{header}</Subtitle>
      </div>
      <div className="flex items-start justify-center gap-8">
        {showCards.map((b) => (
          <div
            className="flex-grow bg-white shadow-xl rounded-xl p-8"
            key={b.title}
          >
            <div className="rounded-md text-center">
              <Subtitle>{b.title}</Subtitle>
              <img
                title={b.title}
                src={b.image || "/images/logo.png"}
                className={"mb-4"}
              />
              <p>{b.description || `Description for ${b.title}`}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export const Stats = ({
  statHeader,
  statSubheader,
  stats,
}: {
  statHeader: string;
  statSubheader: string;
  stats: { value: string; label: string }[];
}) => {
  return (
    <>
      <h4>{statHeader}</h4>
      <h6>{statSubheader}</h6>
      <div
        style={{
          display: "flex",
          gap: 64,
          alignItems: "flex-start",
          justifyContent: "space-evenly",
        }}
      >
        {stats.map((s) => (
          <div style={{ display: "flex", width: "33%" }} key={s.label}>
            <h4>{s.value}</h4>
            <h6 style={{ margin: 0 }}>{s.label}</h6>
          </div>
        ))}
      </div>
    </>
  );
};

const Landing = ({ children }: { children: React.ReactNode[] }) => {
  return (
    <div className={"w-full"}>
      <style>{`main.max-w-none {
  max-width: none;
}

main.my-0 {
  margin-top: 0;
  margin-bottom: 0;
}`}</style>
      {children.map((c, i) => (
        <div
          className={`py-16 flex justify-center bg-opacity-25 ${
            i % 4 === 2
              ? "bg-sky-400"
              : i % 4 === 0
              ? "bg-orange-400"
              : "bg-inherit"
          }`}
          key={i}
        >
          <div className="max-w-4xl w-full">{c}</div>
        </div>
      ))}
    </div>
  );
};

Landing.handle = {
  mainClassName: "max-w-none my-0",
};

export default Landing;
