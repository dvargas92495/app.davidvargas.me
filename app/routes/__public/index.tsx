import React, { useCallback, useEffect, useState } from "react";
import Landing, { Showcase, Splash } from "~/package/components/Landing";
import subscribeToConvertkitAction from "~/package/backend/subscribeToConvertkitAction.server";
export { default as CatchBoundary } from "~/package/components/DefaultCatchBoundary";
export { default as ErrorBoundary } from "~/package/components/DefaultErrorBoundary";

const Home: React.FC = () => {
  const [isWaitlist, setIsWaitlist] = useState(false);
  const callback = useCallback(
    (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        setIsWaitlist(e.shiftKey);
      }
    },
    [setIsWaitlist]
  );
  useEffect(() => {
    document.addEventListener("keydown", callback);
    return () => document.removeEventListener("keydown", callback);
  }, [callback]);
  return (
    <Landing>
      <Splash
        title={"Vargas Arts"}
        subtitle={
          "Application template used to instantiate all Vargas Arts applications"
        }
        primaryHref={isWaitlist ? "" : "revenue"}
        secondaryHref={isWaitlist ? "" : "components"}
        isWaitlist={isWaitlist}
      />
      <Showcase
        header="We are built on the following technologies"
        showCards={[
          {
            title: "Remix",
            description: "Server Side Rendering Web Framework",
          },
          {
            title: "AWS",
            description: "Premiere Cloud Infrastructure Offering",
          },
          {
            title: "Terraform",
            description: "Infrastructure As Code Framework",
          },
        ]}
      />
    </Landing>
  );
};

export const action = subscribeToConvertkitAction;

export const handle = Landing.handle;

export default Home;
