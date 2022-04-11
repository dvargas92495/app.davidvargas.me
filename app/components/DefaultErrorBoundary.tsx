import React from "react";
import type { ErrorBoundaryComponent } from "remix";

const DefaultErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return (
    <main className={"font-sans p-8 w-full"}>
      <h1 className={"text-xl mb-4"}>Application Error</h1>
      <h3 className={"text-lg mb-2"}>
        {error.message}
      </h3>
      <pre className="a p-8 bg-red-800 bg-opacity-10 text-red-900 overflow-auto">
        {error.stack}
      </pre>
    </main>
  );
};

export default DefaultErrorBoundary;
