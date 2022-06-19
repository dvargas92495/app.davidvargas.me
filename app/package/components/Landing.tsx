import React, { SVGAttributes } from "react";
import { Form, Link } from "@remix-run/react";
import Subtitle from "./Subtitle";
import TextInput from "./TextInput";
import Title from "./Title";
import Button from "./Button";
import SuccessfulActionToast from "./SuccessfulActionToast";

export const Splash = ({
  Logo,
  title,
  subtitle,
  ...rest
}: {
  Logo: React.FunctionComponent<SVGAttributes<{}>>;
  title: string;
  subtitle: string;
} & (
  | { primaryHref: string; secondaryHref: string }
  | { convertKitId: string }
)) => {
  return (
    <div className={"flex items-center gap-24"}>
      <div className={"w-1/2"}>
        <Title>{title}</Title>
        <Subtitle>
          <i className="font-normal">{subtitle}</i>
        </Subtitle>
        {"convertKitId" in rest ? (
          <Form className="flex gap-8">
            <TextInput placeholder="hello@example.com" name={"email"} />
            <Button>Get On The Waitlist</Button>
          </Form>
        ) : (
          <div className="flex gap-8">
            <Link
              to={`/${rest.primaryHref}`}
              className={
                "py-3 px-6 bg-sky-500 font-medium capitalize shadow-sm hover:shadow-md hover:bg-sky-700 active:shadow-none active:bg-sky-900 rounded-md"
              }
            >
              <span>Getting Started</span>
            </Link>
            <Link
              to={`/${rest.secondaryHref}`}
              className={
                "py-3 px-6 text-sky-500 border border-sky-500 rounded-md font-medium capitalize box-border hover:text-sky-700 hover:border-sky-700 hover:border-2 active:bg-sky-900 active:bg-opacity-25"
              }
            >
              <span>Explore</span>
            </Link>
          </div>
        )}
      </div>
      <div className="flex-grow text-center">
        <Logo
          style={{
            width: "100%",
            height: "100%",
          }}
        />
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
          <div className="flex-grow bg-white shadow-lg" key={b.title}>
            <div className="rounded-md h-80">
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
  max-width: none;
}`}</style>
      {children.map((c, i) => (
        <div
          className={`py-8 text-center bg-opacity-25 ${
            i % 4 === 2
              ? "bg-sky-500"
              : i % 4 === 0
              ? "bg-orange-500"
              : "bg-inherit"
          }`}
          key={i}
        >
          <div className="max-w-5xl">{c}</div>
        </div>
      ))}
    </div>
  );
};

Landing.handle = {
  mainClassName: "max-w-none my-0",
};

export default Landing;
