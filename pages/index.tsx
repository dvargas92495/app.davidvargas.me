import React from "react";
import Layout, {LayoutHead} from "@dvargas92495/ui/dist/components/Layout";

const Home: React.FunctionComponent = () => <Layout homeIcon={"DV"}>Welcome!</Layout>;

export const Head = () => <LayoutHead title={'Vargas Arts App'}/>

export default Home;
