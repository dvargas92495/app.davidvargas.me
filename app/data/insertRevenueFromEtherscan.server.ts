import getMysqlConnection from "@dvargas92495/api/mysql";
import { v4 } from "uuid";

const insertRevenueFromEtherscan = ({
  userId,
  revenue: { date, amount, product, connect, source, sourceId },
  etherscan,
}: {
  userId: string;
  revenue: {
    date: Date;
    amount: number;
    product: string;
    connect: number;
    source: string;
    sourceId: string;
  };
  etherscan: {
    timestamp: number,
    from: string,
    to: string,
    gas: string,
    id: string,
    type: string,
    value: string,
  };
}) => {
  return getMysqlConnection().then((connection) => {
    return connection
      .execute(
        `INSERT INTO etherscan (date, source, target, gas, hash, method, value, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [new Date(etherscan.timestamp), etherscan.from, etherscan.to, etherscan.gas, etherscan.id, etherscan.type, etherscan.value, userId]
      )
      .then(() =>
        connection.execute(
          `INSERT INTO revenue (uuid, source, source_id, date, amount, product, connect) 
     VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE amount=amount`,
          [v4(), source, sourceId, date, amount, product, connect]
        )
      );
  });
};

export default insertRevenueFromEtherscan;
