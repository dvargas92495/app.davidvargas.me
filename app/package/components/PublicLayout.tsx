import React from "react";
import { Link, Outlet, useMatches } from "@remix-run/react";

const PublicPage: React.FC<{
  homeIcon?: React.ReactNode;
  pages?: string[];
}> = ({ pages = [], homeIcon = <img src={`/images/logo.png`} /> }) => {
  const matches = useMatches();
  const mainClassName =
    matches.reverse().find((m) => m.handle?.mainClassName)?.handle
      ?.mainClassName || "";
  const rootClassName =
    matches.reverse().find((m) => m.handle?.rootClassName)?.handle
      ?.rootClassName || "";
  return (
    <div className={`flex flex-col min-h-full ${rootClassName}`}>
      <header className="static bg-transparent shadow-xl z-10">
        <div className="px-6 h-16 flex items-center">
          <Link to={"/"} className="flex max-h-full w-16 mr-32">
            {homeIcon}
          </Link>
          <div className="justify-start flex-grow flex gap-6 capitalize text-lg items-center h-full">
            {pages.map((p) => (
              <h6 className="mx-2 text-xl" key={p}>
                <a
                  href={`/${p}`}
                  color="inherit"
                  className={
                    "text-gray-400 hover:text-gray-700 active:text-gray-800 hover:no-underline active:no-underline cursor-pointer"
                  }
                >
                  {p}
                </a>
              </h6>
            ))}
          </div>
          <div className="w-48 flex justify-end items-center" />
        </div>
      </header>
      <main
        className={`my-16 mx-auto flex justify-center max-w-3xl w-full p-0 flex-grow ${mainClassName}`}
      >
        <Outlet />
      </main>
      <footer className="px-6 py-4 m-t-auto bg-orange-400 bg-opacity-25">
        <hr className="border-gray-400" />
        <div className="flex mt-4">
          <div className="w-1/3 text-gray-400 text-xs">
            <p>© {new Date().getFullYear()} Vargas Arts, LLC</p>
          </div>
          <div className="w-2/3">
            <h6 className="text-xl font-bold mb-8">Site Links</h6>
            {["About", "Terms of Use", "Privacy Policy", "Contact"].map(
              (l, i) => (
                <p key={i}>
                  <a
                    href={`/${l.toLowerCase().replace(/ /g, "-")}`}
                    color="inherit"
                    className=" text-gray-400 text-xs"
                  >
                    {l}
                  </a>
                </p>
              )
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicPage;
