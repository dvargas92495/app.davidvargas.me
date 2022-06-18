import React from "react";
import DefaultErrorBoundary from "./DefaultErrorBoundary";
import { useCatch } from "@remix-run/react";
import type { CatchBoundaryComponent } from "@remix-run/react/routeModules";

const DefaultCatchBoundary: CatchBoundaryComponent = (): React.ReactElement => {
  const caught = useCatch();
  return (
    <DefaultErrorBoundary
      error={
        new Error(
          typeof caught?.data === "object"
            ? JSON.stringify(caught.data)
            : typeof caught === "object"
            ? JSON.stringify(caught)
            : `No Caught Data: ${caught}`
        )
      }
    />
  );
};

export default DefaultCatchBoundary;
