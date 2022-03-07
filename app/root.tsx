import RemixRoot, {
  getRootLinks,
  getRootLoader,
  getRootMeta,
  RootCatchBoundary,
} from "@dvargas92495/ui/components/RemixRoot";

export const loader = getRootLoader();
export const meta = getRootMeta();
export const links = getRootLinks();
export const CatchBoundary = RootCatchBoundary;
export default RemixRoot;
