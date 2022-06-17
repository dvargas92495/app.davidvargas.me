import getMysqlConnection from "~/package/backend/mysql.server";
import axios from "axios";
import dateFnsFormat from "date-fns/format";
import type mysql from "mysql2";
import Web3 from "web3";

const addressBook: Record<string, string> = {
  "0x8dca852d10c3cfccb88584281ec1ef2d335253fd": "cabindao.eth",
  "0x2f0acb9c5dd2a3511bc1d9d67258e5c9434ba569": "Chainlink",
  "0x4d846da8257bb0ebd164eff513dff0f0c2c3c0ba": "Wyre",
  "0x283af0b28c62c092c9727f1ee09c02ca627eb7f5": "ENS",
  "0x0000000000000000000000000000000000000000": "NULL",
  "0x94515e4f6fabad73c8bcdd8cd42f0b5c037e2c49": "CabinDAO CrowdFund",
  "0x3cd751e6b0078be393132286c442345e5dc49699": "Coinbase",
  "0xb5d85cbf7cb3ee0d56b3bb207d5fc4b82f43f511": "Coinbase",
  "0x084b1c3c81545d370f3634392de611caabff8148": "ENS",
  "0x514910771af9ca656af840dff83e8264ecf986ca": "Uniswap",
  "0x881d40237659c251811cec9c364ef91dc08d300c": "Uniswap",
  "0x74de5d4fcbf63e00296fd95d33236b9794016631": "Uniswap",
  "0xeb2629a2734e272bcc07bda959863f316f4bd4cf": "Coinbase",
  "0x5fdcca53617f4d2b9134b29090c87d01058e27e9": "Immutable",
  "0xddfabcdc4d8ffc6d5beaf154f18b778f892a0740": "Coinbase",
  "0xc18360217d8f7ab5e7c516566761ea12ce7f9d72": "Uniswap",
  "0x77fde505d3aa92ed10519debe2c5749398a269ca": "Immutable",
  "0x45a4daa94b7ed7a34b442bf08e1091c0f5eda0e6": "Coinbase",
  "0x4d05e3d48a938db4b7a9a59a802d5b45011bde58": "RocketPool",
  "0x04c8369c9d7581ffafa04c90a08aafe7a7057244": "CabinDAO Mirror",
  "0x2330ee705ffd040bb0cba8cb7734dfe00e7c4b57": "CabinDAO Mirror",
  "0xc5e9ddebb09cd64dfacab4011a0d5cedaf7c9bdb": "Proof of Humanity",
  "0x82458d1c812d7c930bb3229c9e159cbabd9aa8cb": "Proof of Humanity",
  "0x1934e252f840aa98dfce2b6205b3e45c41aef830": "Uniswap",
  "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45": "Uniswap",
  "0x596bef23db467d0fd7cb996a77b381f9fa113f86": "Uniswap",
  "0xbec26ffa12c90217943d1b2958f60a821ae6e549": "hillis.eth",
  "0xa7da6ce63538c5b11dd2bf62a99102bbdfd0fd6a": "Uniswap",
};

const listEtherscanRecords = (userId: string, connection?: mysql.Connection) =>
  import("@clerk/clerk-sdk-node")
    .then((clerk) => clerk.users.getUser(userId))
    .then(async (user) => {
      const account = user.publicMetadata.ethereum as {
        address: string;
        startNumber?: number;
        etherscan?: string;
      };
      if (!account || !account.address) {
        throw new Response(
          `User has not yet connected their Ethereum address`,
          {
            status: 403,
          }
        );
      }
      const recordedTxs = await getMysqlConnection(connection).then((con) =>
        Promise.all([
          con.execute(
            `SELECT source_id FROM revenue WHERE source = "etherscan"`,
            []
          ),
          con.execute(
            `SELECT source_id FROM expenses WHERE source = "etherscan"`,
            []
          ),
          con.execute(
            `SELECT source_id FROM personal_transfers WHERE source = "etherscan"`,
            []
          ),
        ]).then(([a, b, c]) => {
          const txs = (a as { source_id: string }[])
            .concat(b as { source_id: string }[])
            .concat(c as { source_id: string }[]);
          return new Set(txs.map((r) => r.source_id));
        })
      );
      const address = account.address.toLowerCase();
      const apikey = account.etherscan || "";
      const startblock = account.startNumber || 0;
      const endblock = await new Web3(
        `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
      ).eth.getBlockNumber();

      return Promise.all([
        axios.get<{
          result: {
            value: string;
            gasUsed: string;
            gasPrice: string;
            from: string;
            to: string;
            hash: string;
            timeStamp: string;
          }[];
        }>(
          `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&apikey=${apikey}&startblock=${startblock}&endblock=${endblock}`
        ),
        axios.get<{
          result: {
            value: string;
            from: string;
            to: string;
            hash: string;
            timeStamp: string;
          }[];
        }>(
          `https://api.etherscan.io/api?module=account&action=txlistinternal&address=${address}&apikey=${apikey}&startblock=${startblock}&endblock=${endblock}`
        ),
        axios.get<{
          result: {
            value: string;
            from: string;
            to: string;
            gasUsed: string;
            gasPrice: string;
            hash: string;
            timeStamp: string;
            tokenName: string;
            tokenSymbol: string;
            tokenDecimal: string;
          }[];
        }>(
          `https://api.etherscan.io/api?module=account&action=tokentx&address=${address}&apikey=${apikey}&startblock=${startblock}&endblock=${endblock}`
        ),
      ]).then(([txlist, txlistinternal, tokentx]) => {
        return {
          columns: [
            { Header: "Date", accessor: "date" },
            { Header: "Type", accessor: "type" },
            { Header: "Value", accessor: "value" },
            { Header: "Gas", accessor: "gas" },
            { Header: "From", accessor: "from" },
            { Header: "To", accessor: "to" },
          ],
          data: txlist.data.result
            .map(({ value, ...r }) => ({
              ...r,
              type: "Public",
              value: `${(Number(value) / Math.pow(10, 18)).toFixed(6)} ETH`,
            }))
            .concat(
              txlistinternal.data.result.map(({ value, ...r }) => ({
                ...r,
                gasPrice: "0",
                gasUsed: "0",
                value: `${(Number(value) / Math.pow(10, 18)).toFixed(6)} ETH`,
                type: "Internal",
              }))
            )
            .concat(
              tokentx.data.result.map(
                ({ tokenName, tokenSymbol, tokenDecimal, value, ...r }) => ({
                  ...r,
                  type: "Token",
                  value: `${
                    Number(value) / Math.pow(10, Number(tokenDecimal))
                  } ${tokenName} (${tokenSymbol})`,
                })
              )
            )
            .filter((t) => !recordedTxs.has(t.hash.toLowerCase()))
            .map((r) => ({
              gas: `${
                (Number(r.gasUsed) * Number(r.gasPrice)) / Math.pow(10, 18)
              } ETH`,
              value: r.value,
              type: r.type,
              hash: r.hash.toLowerCase(),
              from: r.from === address ? "ME" : addressBook[r.from] || r.from,
              to: r.to === address ? "ME" : addressBook[r.to] || r.to,
              timestamp: Number(r.timeStamp) * 1000,
              date: dateFnsFormat(
                new Date(Number(r.timeStamp) * 1000),
                "yyyy-MM-dd hh:mm a"
              ),
            }))
            .sort((a, b) => a.timestamp - b.timestamp),
        };
      });
    });

export default listEtherscanRecords;
