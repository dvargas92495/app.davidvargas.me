import RemixRoot, {
  getRootLinks,
  getRootMeta,
  RootCatchBoundary,
} from "@dvargas92495/ui/components/RemixRoot";
import remixRootLoader from "@dvargas92495/ui/utils/remixRootLoader.server";

export const loader = remixRootLoader;
export const meta = getRootMeta();
export const links = getRootLinks();
export const CatchBoundary = RootCatchBoundary;
export default RemixRoot;
