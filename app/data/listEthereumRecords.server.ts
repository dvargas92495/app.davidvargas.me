import getMysqlConnection from "~/package/backend/mysql.server";
import axios from "axios";
import dateFnsFormat from "date-fns/format";
import type mysql from "mysql2";
import Web3 from "web3";
import addressBook from "~/enums/addressBook";

const listEtherscanRecords = (
  userId: string,
  smart?: boolean,
  connection?: mysql.Connection
) =>
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
            `SELECT source_id FROM revenue WHERE source = "ethereum"`,
            []
          ),
          con.execute(
            `SELECT source_id FROM expenses WHERE source = "ethereum"`,
            []
          ),
          con.execute(
            `SELECT source_id FROM personal_transfers WHERE source = "ethereum"`,
            []
          ),
        ]).then(([a, b, c]) => {
          con.destroy();
          const txs = (a as { source_id: string }[])
            .concat(b as { source_id: string }[])
            .concat(c as { source_id: string }[]);
          return new Set(txs.map((r) => r.source_id));
        })
      );
      const address = account.address.toLowerCase();
      const apikey = account.etherscan || "";
      const startblock = smart ? account.startNumber || 0 : 0;
      const endblock = smart
        ? await new Web3(
            `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
          ).eth.getBlockNumber()
        : 99999999;

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
