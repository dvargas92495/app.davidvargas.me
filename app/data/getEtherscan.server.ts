import getMysqlConnection from "~/package/backend/mysql.server";

const getEtherscan = async ({
  params,
}: {
  params: Record<string, string | undefined>;
}) => {
  const id = params["id"] || "";
  const [hash, index] = id.split("-");
  return getMysqlConnection().then((connection) => {
    return Promise.all([
      connection
        .execute(
          `SELECT hash, tx_index FROM etherscan
              WHERE hash = ? AND tx_index = ?`,
          [hash, index]
        )
        .then((a) => (a as {}[]).length),
      connection
        .execute(
          `SELECT amount, product as description FROM revenue WHERE source_id = ? AND source = "etherscan"`,
          [id]
        )
        .then((a) => a as { amount: number; description: string }[]),
      connection
        .execute(
          `SELECT amount, product as description FROM revenue WHERE source_id = ? AND source = "etherscan"`,
          [hash]
        )
        .then((a) => a as { amount: number; description: string }[]),
      connection
        .execute(
          `SELECT amount, description FROM expenses WHERE source_id = ? AND source = "etherscan"`,
          [id]
        )
        .then((a) => a as { amount: number; description: string }[]),
      connection
        .execute(
          `SELECT amount, description FROM expenses WHERE source_id = ? AND source = "etherscan"`,
          [hash]
        )
        .then((a) => a as { amount: number; description: string }[]),
      connection
        .execute(
          `SELECT amount, description FROM personal_transfers WHERE source_id = ? AND source = "etherscan"`,
          [id]
        )
        .then((a) => a as { amount: number; description: string }[]),
      connection
        .execute(
          `SELECT amount, description FROM personal_transfers WHERE source_id = ? AND source = "etherscan"`,
          [hash]
        )
        .then((a) => a as { amount: number; description: string }[]),
    ]).then(
      ([
        etherscan,
        correctRevenue,
        incorrectRevenue,
        correctExpense,
        incorrectExpense,
        correctPersonal,
        incorrectPersonal,
      ]) => ({
        etherscan,
        correctRevenue,
        incorrectRevenue,
        correctExpense,
        incorrectExpense,
        correctPersonal,
        incorrectPersonal,
        amount:
          correctRevenue[0]?.amount ||
          incorrectRevenue[0]?.amount ||
          correctExpense[0]?.amount ||
          incorrectExpense[0]?.amount ||
          correctPersonal[0]?.amount ||
          incorrectPersonal[0]?.amount,
        description:
          correctRevenue[0]?.description ||
          incorrectRevenue[0]?.description ||
          correctExpense[0]?.description ||
          incorrectExpense[0]?.description ||
          correctPersonal[0]?.description ||
          incorrectPersonal[0]?.description,
      })
    );
  });
};

export default getEtherscan;
