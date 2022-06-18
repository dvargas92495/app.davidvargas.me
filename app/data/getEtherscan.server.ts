import getMysqlConnection from "~/package/backend/mysql.server";

const getEtherscan = async ({
  params,
}: {
  params: Record<string, string | undefined>;
}) => {
  const hash = params["id"] || "";
  return getMysqlConnection().then((connection) => {
    connection.destroy();
    return { hash };
  });
};

export default getEtherscan;
