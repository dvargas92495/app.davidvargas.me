// import { execute } from "@dvargas92495/api/mysql";
import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import insertRevenueFromStripe from "../../app/data/insertRevenueFromStripe.server";
import mysql from "mysql2";

const DATABASE_URL_REGEX =
  /^mysql:\/\/([a-z0-9_]+):(.{16})@([a-z0-9.-]+):(\d{3,5})\/([a-z_]+)$/;
const matches = DATABASE_URL_REGEX.exec(process.env.DATABASE_URL || "");

export const logic = ({ id }: { id: string }) => {
  if (!matches) return Promise.reject("Failed to parse `DATABASE_URL`");
  const connection = mysql.createConnection({
    host: matches[3],
    user: matches[1],
    port: Number(matches[4]),
    database: matches[5],
    password: matches[2],
  });

  return insertRevenueFromStripe({ id, connection }).then(() => ({
    success: true,
  }));
};

export const handler = createAPIGatewayProxyHandler(logic);
