import React from "react";
import { Link, Outlet, useLoaderData, useMatches } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import TextInput from "~/package/components/TextInput";
import DefaultCatchBoundary from "~/package/components/DefaultCatchBoundary";
import DefaultErrorBoundary from "~/package/components/DefaultErrorBoundary";

const ComponentsPage = () => {
  const componentPages = useLoaderData<string[]>();
  const matches = useMatches();
  const title =
    (matches.find((match) => match.handle)?.handle?.title as string) ||
    matches[matches.length - 1].pathname
      .split("/")
      .slice(-1)[0]
      .split("-")
      .map((s) => `${s.slice(0, 1).toUpperCase()}${s.slice(1)}`)
      .join("");
  return (
    <div className="flex min-h-full h-full">
      <div className="w-96 pt-8 flex flex-col bg-gray-200 h-full flex-shrink-0">
        <div className="px-4">
          <TextInput placeholder="Search... (Coming Soon)" />
        </div>
        <hr className="bg-black" />
        {componentPages.map((cp) => (
          <Link
            key={cp}
            to={`/components/${cp
              .match(/(?:^|[A-Z])[a-z]+/g)
              ?.map((s) => s.toLowerCase())
              .join("-")}`}
            className={"p-4 hover:bg-gray-400 hover:blue-900 cursor-pointer"}
          >
            {cp}
          </Link>
        ))}
      </div>
      <div className="p-16 flex-grow flex flex-col">
        <h1 className="text-xl font-bold mb-8">{title}</h1>
        <div className="border-dashed border-gray-200 border flex-grow p-4 rounded-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export const loader: LoaderFunction = () => {
  return [
    "BaseInput",
    "Button",
    "ConvertKit",
    "Dashboard",
    "DefaultCatchBoundary",
    "DefaultErrorBoundary",
    "Dialog",
    "Landing",
    "NumberInput",
    "SuccessfulActionToast",
    "Table",
    "TextInput",
    "Toast",
  ];
};

export const handle = {
  mainClassName: "w-full flex-grow h-full",
};

export const CatchBoundary = DefaultCatchBoundary;

export const ErrorBoundary = DefaultErrorBoundary;

export default ComponentsPage;
