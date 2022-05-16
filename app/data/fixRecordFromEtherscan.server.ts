import getMysqlConnection from "~/package/backend/mysql.server";

const fixRecordFromEtherscan = async ({
  params,
}: {
  userId: string;
  params: Record<string, string | undefined>;
}) => {
  const id = params["id"] || "";
  const [hash, index] = id.split("-");
  return getMysqlConnection()
    .then((connection) => {
      return connection
        .execute(`UPDATE etherscan SET tx_index = ? WHERE hash = ?`, [
          Number(index),
          hash,
        ])
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
