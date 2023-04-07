import React from "react";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  useCatch,
  ScrollRestoration,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import Loading from "./Loading";
import type remixRootLoader from "../backend/remixRootLoader.server";
// primary: "sky-400",
// secondary: "orange-400",

export const getRootMeta =
  (tags: ReturnType<MetaFunction> = {}): MetaFunction =>
  () => {
    return {
      charSet: "utf-8",
      viewport: "width=device-width,initial-scale=1",
      "og:type": "website",
      "twitter:card": "summary",
      "twitter:creator": "@dvargas92495",
      ...tags,
    };
  };

export const getRootLinks =
  (links: ReturnType<LinksFunction> = []): LinksFunction =>
  () => {
    return [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap",
      },
      ...links,
    ];
  };

export const RootCatchBoundary = () => {
  const caught = useCatch();
  return (
    <html>
      <head>
        <title>Oops!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <h1>
          {caught.status} {caught.statusText}
        </h1>
        <Scripts />
      </body>
    </html>
  );
};

const PageTransition = () => {
  const transition = useTransition();
  return transition.state === "loading" ? (
    <div className="left-2 bottom-2 fixed z-50">
      <Loading />
    </div>
  ) : null;
};

type LoaderData = Awaited<ReturnType<typeof remixRootLoader>>;

const App = () => {
  const data = useLoaderData<LoaderData>();
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Outlet />
        <PageTransition />
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.process = {
  env: ${JSON.stringify(data?.ENV || {})}
};`,
          }}
        />
        <Scripts />
        {!data.hideLiveReload && <LiveReload />}
      </body>
    </html>
  );
};

const RemixRoot = () => App();

export default RemixRoot;
