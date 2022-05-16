import getMysqlConnection from "~/package/backend/mysql.server";

const fixRecordFromEtherscan = async ({
  userId,
  data,
  params,
}: {
  userId: string;
  data: Record<string, string[]>;
  params: Record<string, string | undefined>;
}) => {
  const id = params["id"] || "";
  const [hash, index] = id.split("-");
  return getMysqlConnection()
    .then((connection) => {
      return connection
        .execute(
          `INSERT INTO etherscan (date, source, target, gas, hash, method, value, user_id, tx_index) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) 
          ON DUPLICATE KEY UPDATE value=value`,
          [
            new Date(data.date[0]),
            data.from[0],
            data.to[0],
            data.gas[0],
            hash,
            data.type[0],
            data.value[0],
            userId,
            Number(index),
          ]
        )
        .then(() =>
          Promise.all([
            connection
              .execute(
                `UPDATE revenue SET source_id = ? WHERE source_id = ? AND source = "etherscan"`,
                [id, hash]
              )
              .then((a) => a as { amount: number; description: string }[]),
            connection
              .execute(
                `UPDATE expenses SET source_id = ? WHERE source_id = ? AND source = "etherscan"`,
                [id, hash]
              )
              .then((a) => a as { amount: number; description: string }[]),
            connection
              .execute(
                `UPDATE personal_transfers SET source_id = ? WHERE source_id = ? AND source = "etherscan"`,
                [id, hash]
              )
              .then((a) => a as { amount: number; description: string }[]),
          ])
        );
    })
    .then(() => ({ success: true }));
};

export default fixRecordFromEtherscan;
