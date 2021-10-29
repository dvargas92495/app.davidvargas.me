import createAPIGatewayProxyHandler from "aws-sdk-plus";
import { fromWei } from "web3-utils";
import { Eth } from "web3-eth";

const web3 = new Eth();

const logic = ({ address }: { address: string }) =>
  web3
    .getBalance(address)
    .then((b) => fromWei(b, "ether"))
    .then((eth) => ({ eth }));

export const handler = createAPIGatewayProxyHandler(logic);
