import { Link, useMatches } from "@remix-run/react";

const TabLink = ({
  children,
  to,
  base,
}: React.PropsWithChildren<{ to: string; base: number }>) => {
  const matches = useMatches();
  const current = matches[base + 1]?.pathname;
  const root = matches[base].pathname;
  const active = `${root}/${to}` === current;
  return (
    <Link
      to={to}
      className={`rounded-lg border border-sky-600 text-sky-600 hover:bg-sky-100 cursor-pointer active:bg-sky-200 py-2 px-4 ${
        active ? "bg-sky-200" : "bg-none"
      }`}
    >
      {children}
    </Link>
  );
};

export default TabLink;
