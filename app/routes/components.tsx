import React from "react";
import { Link, Outlet, useLoaderData, useMatches } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import TextInput from "~/package/components/TextInput";

const ComponentsPage = () => {
  const componentPages = useLoaderData<string[]>();
  const title = useMatches().find((match) => match.handle)?.handle
    ?.title as string;
  return (
    <div className="flex min-h-full h-full">
      <div className="w-96 pt-16">
        <TextInput placeholder="Search... (Coming Soon)" />
        {componentPages.map((cp) => (
          <Link to={`/${cp}`}>{cp}</Link>
        ))}
      </div>
      <div className="p-16 flex-grow">
        <h1 className="text-xl font-bold mb-8">{title}</h1>
        <Outlet />
      </div>
    </div>
  );
};

export const loader: LoaderFunction = () => {
  return ["About", "BaseInput", "Button", "Contact"];
};

export default ComponentsPage;
