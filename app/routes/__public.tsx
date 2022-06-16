import PublicPage, { loader } from "~/package/components/PublicLayout";

export { loader };

export default () => <PublicPage pages={["revenue", "components"]} />;
