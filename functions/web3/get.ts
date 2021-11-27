import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import { fromWei } from "web3-utils";
import {Eth} from "web3-eth";

const logic = ({ address }: { address: string }) => {
  // this line currently breaks
  const web3 = new Eth();
  return web3
    .getBalance(address)
    .then((b) => fromWei(b, "ether"))
    .then((eth) => ({ eth }));
};

export const handler = createAPIGatewayProxyHandler(logic);
