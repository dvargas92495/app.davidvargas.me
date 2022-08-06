import createAPIGatewayProxyHandler from "~/package/backend/createAPIGatewayProxyHandler.server";
import axios from "axios";

const tokens = {
  ENS: { address: "0xc18360217d8f7ab5e7c516566761ea12ce7f9d72" },
  RocketPool: { address: "0xae78736Cd615f374D3085123A210448E74Fc6393" },
  CABIN: { address: "0x1934E252f840aA98dfCe2b6205B3E45c41AeF830" },
  GODS: { address: "0xccC8cb5229B0ac8069C51fd58367Fd1e622aFD97" },
  UBI: { address: "0xDd1Ad9A21Ce722C151A836373baBe42c868cE9a4" },
};

const logic = () => {
  return Promise.all(
    Object.entries(tokens).map(
      ([key, { address }]) =>
        axios
        // .get(
        //   `https://api.uniswap.org/v1/quote?protocols=v2%2Cv3&tokenInAddress=${address}&tokenInChainId=1&tokenOutAddress=0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2&tokenOutChainId=1&amount=1000000000000000000&type=exactIn`
        // )
        // .then(r => r.data)
      .post("https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v1", {
        query: `{tokens(where: {id: "${address.toLowerCase()}"}) { derivedETH }}`,
      })
      .then((r) => 1 / Number(r.data.data.tokens[0]["derivedETH"]))
      .then((price) => [key, { price }])
      .catch(() => [key, 'error'])
    )
  )
    .then((tokens) => ({ tokens: Object.fromEntries(tokens) }))
    .catch((e) => {
        console.log(e)
      return { error: e.response.data };
    });
};

export const handler = createAPIGatewayProxyHandler(logic);
