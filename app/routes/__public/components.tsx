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
    <div className="flex max-h-full w-full">
      <div className="w-96 pt-8 flex flex-col bg-gray-200 h-full flex-shrink-0 overflow-auto scrollbar-thin">
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
      <div className="p-16 flex-grow flex flex-col overflow-auto">
        <h1 className="text-xl font-bold mb-8">{title}</h1>
        <div className="border-dashed border-gray-200 border flex-grow p-4 rounded-sm relative">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export const loader: LoaderFunction = () => {
  return [
    "AutoCompleteInput",
    "BaseInput",
    "Button",
    "Checkbox",
    "CodeInput",
    "ConvertKit",
    "Dashboard",
    "DefaultCatchBoundary",
    "DefaultErrorBoundary",
    "Dialog",
    "DownloadFile",
    "Landing",
    "Loading",
    "NumberInput",
    "Select",
    "SuccessfulActionToast",
    "Switch",
    "Table",
    "Textarea",
    "TextInput",
    "Toast",
    "UploadFile"
  ];
};

export const handle = {
  mainClassName: "h-full mx-0 my-0 max-w-none overflow-hidden",
  rootClassName: "max-h-full",
};

export const CatchBoundary = DefaultCatchBoundary;

export const ErrorBoundary = DefaultErrorBoundary;

export default ComponentsPage;
