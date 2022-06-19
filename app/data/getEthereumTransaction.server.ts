import Web3 from "web3";
import dateFnsFormat from "date-fns/format";
import addressBook from "~/enums/addressBook";

const getEthereumTransaction = async ({
  userId,
  params,
}: {
  userId: string;
  params: Record<string, string | undefined>;
}) => {
  const web3 = new Web3(
    `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
  );
  const hash = params["id"] || "";
  return web3.eth.getTransaction(hash).then((tx) =>
    Promise.all([
      web3.eth.getTransactionReceipt(hash),
      web3.eth.getBlock(tx.blockNumber || 0),
      import("@clerk/clerk-sdk-node")
        .then((clerk) => clerk.users.getUser(userId))
        .then(async (user) => {
          const account = user.publicMetadata.ethereum as {
            address: string;
          };
          return account.address;
        }),
    ]).then(([receipt, block, address]) => {
      const from = tx.from.toLowerCase();
      const to = (tx.to || "").toLowerCase();
      // receipt.events - this will have log events that would be juicy
      return {
        hash,
        date: dateFnsFormat(
          new Date(Number(block.timestamp) * 1000),
          "yyyy-MM-dd hh:mm a"
        ),
        from: tx.from === address ? "ME" : addressBook[from] || from,
        to: tx.to === address ? "ME" : addressBook[to] || to,
        gas: `${(Number(receipt.gasUsed) * Number(tx.gasPrice)) / Math.pow(10, 18)} ETH`,
        value: `${(Number(tx.value) / Math.pow(10, 18)).toFixed(6)} ETH`,
      };
    })
  );
};

export default getEthereumTransaction;
