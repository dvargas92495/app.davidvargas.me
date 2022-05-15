import React from "react";
import type { ErrorBoundaryComponent } from "@remix-run/server-runtime";
import { useMatches } from "@remix-run/react";

const DefaultErrorBoundary: ErrorBoundaryComponent = ({
  error,
}): React.ReactElement => {
  const matches = useMatches();
  const logUrl = matches[0].data.logUrl;
  return (
    <main className={"font-sans p-8 w-full"}>
      <h1 className={"text-xl font-bold mb-4"}>Application Error</h1>
      <h3 className={"text-lg font-semibold mb-2"}>{error.message}</h3>
      <pre className="p-8 bg-red-800 bg-opacity-10 text-red-900 border-red-900 border-2 rounded-sm overflow-auto mb-4">
        {error.stack}
      </pre>
      <p>
        Check out the rest of the logs on{" "}
        <a
          href={logUrl}
          target={"_blank"}
          rel={"noreferrer"}
        >
          AWS
        </a>.
      </p>
    </main>
  );
};

export default DefaultErrorBoundary;
