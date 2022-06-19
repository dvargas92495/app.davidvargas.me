import getMysqlConnection from "~/package/backend/mysql.server";
import { v4 } from "uuid";
import axios from "axios";
import { z } from "zod";

const dataSchema = z.object({
  amount: z.array(z.string()),
  category: z.array(z.string()),
  hash: z.array(z.string()),
  description: z.array(z.string()),
  date: z.array(z.string()),
  from: z.array(z.string()),
  to: z.array(z.string()),
  gas: z.array(z.string()),
});

const insertRecordFromEtherscan = async ({
  data: _data,
  params,
}: {
  data: Record<string, string[]>;
  params: Record<string, string | undefined>;
}) => {
  console.log('start to insert');
  const data = dataSchema.parse(_data);
  const amount = data.amount[0];
  const category = data.category[0];
  const {id: hash = ''} = params;
  const [originalDescription] = data.description;
  const [code, ...des] = originalDescription.split(" - ");
  const description = des.join(" - ");
  const date = new Date(data.date[0]);
  const dateArg = `${date.getDate().toString().padStart(2, "0")}-${(
    date.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${date.getFullYear()}`;
    console.log('let get some price info', hash, code, description, );
    const ethPrice = await axios
    .get(
      `https://api.coingecko.com/api/v3/coins/ethereum/history?date=${dateArg}`
    )
    .then((r) => r.data.market_data.current_price.usd)
    .catch((e) => {
      throw new Response(
        `Failed to get ETH price from CoinGecko: ${e.response?.data}`
      );
    });
    console.log('ethProce', ethPrice);
  const [tokenAmount, tokenType] = amount.split(" ");
  const tokenPrice =
    !tokenType || /^eth$/.test(tokenType)
      ? 1
      : await axios
          .get(
            `https://api.coingecko.com/api/v3/coins/${tokenType.toLowerCase()}/history?date=${dateArg}`
          )
          .then((r) => r.data.market_data.current_price.eth)
          .catch((e) => {
            throw new Response(
              `Failed to get ETH price from CoinGecko for token type ${tokenType}: ${e.response?.data}`
            );
          });
          console.log('tokenPrice', ethPrice);
  const total =
    Number(tokenAmount) * Number(tokenPrice) * Number(ethPrice) * 100;
    console.log('total', total);
  return getMysqlConnection()
    .then((connection) => {
      console.log('we cxned, lets insert a', category);
      return (
        category === "revenue"
          ? connection.execute(
              `INSERT INTO revenue (uuid, source, source_id, date, amount, product, connect) 
     VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE amount=VALUES(amount)+amount`,
              [v4(), "etherscan", hash, date, total, originalDescription, 0]
            )
          : category === "expense"
          ? connection.execute(
              `INSERT INTO expenses (uuid, source, source_id, date, amount, description, code) 
     VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE VALUES(amount)+amount`,
              [v4(), "etherscan", hash, date, total, description, code]
            )
          : category === "personal"
          ? connection.execute(
              `INSERT INTO personal_transfers (uuid, source, source_id, date, amount, description, code) 
     VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE VALUES(amount)+amount`,
              [v4(), "etherscan", hash, date, total, description, code]
            )
          : Promise.reject(`Unsupported category ${category} for hash ${hash}`)
      ).then(() => connection.destroy());
    })
    .then(() => ({ success: true }));
};

export default insertRecordFromEtherscan;
