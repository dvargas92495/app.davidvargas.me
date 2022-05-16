import getMysqlConnection from "~/package/backend/mysql.server";
import { v4 } from "uuid";
import axios from "axios";

const insertRecordFromEtherscan = async ({
  userId,
  data,
}: {
  userId: string;
  data: Record<string, string[]>;
}) => {
  const value = data.value[0];
  const amount = data.amount[0];
  const category = data.category[0];
  const [hash] = data.hash;
  const [index] = data.index;
  const [originalDescription] = data.description;
  const [code, ...des] = originalDescription.split(" - ");
  const description = des.join(" - ");
  const date = new Date(data.date[0]);
  const price = await axios
    .get(
      `https://api.coingecko.com/api/v3/coins/ethereum/history?date=${date
        .getDate()
        .toString()
        .padStart(2, "0")}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getFullYear()}`
    )
    .then((r) => r.data.market_data.current_price.usd);
  return getMysqlConnection()
    .then((connection) => {
      return connection
        .execute(
          `INSERT INTO etherscan (date, source, target, gas, hash, method, value, user_id, tx_index) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) 
          ON DUPLICATE KEY UPDATE value=value`,
          [
            date,
            data.from[0],
            data.to[0],
            data.gas[0],
            hash,
            data.type[0],
            value,
            userId,
            index,
          ]
        )
        .then(() =>
          category === "revenue"
            ? connection.execute(
                `INSERT INTO revenue (uuid, source, source_id, date, amount, product, connect) 
     VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE amount=amount`,
                [
                  v4(),
                  "etherscan",
                  hash,
                  date,
                  Number(amount) * Number(price) * 100,
                  originalDescription,
                  0,
                ]
              )
            : category === "expense"
            ? connection.execute(
                `INSERT INTO expenses (uuid, source, source_id, date, amount, description, code) 
     VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE amount=amount`,
                [
                  v4(),
                  "etherscan",
                  hash,
                  date,
                  Number(amount) * Number(price) * 100,
                  description,
                  code,
                ]
              )
            : category === "personal"
            ? connection.execute(
                `INSERT INTO personal_transfers (uuid, source, source_id, date, amount, description, code) 
     VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE amount=amount`,
                [
                  v4(),
                  "etherscan",
                  hash,
                  date,
                  Number(amount) * Number(price) * 100,
                  description,
                  code,
                ]
              )
            : Promise.reject(
                `Unsupported category ${category} for hash ${hash}`
              )
        );
    })
    .then(() => ({ success: true }));
};

export default insertRecordFromEtherscan;
