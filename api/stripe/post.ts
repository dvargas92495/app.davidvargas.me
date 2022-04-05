import getMysqlConnection from "@dvargas92495/api/mysql";
import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import insertRevenueFromStripe from "../../app/data/insertRevenueFromStripe.server";

export const logic = ({ id }: { id: string }) =>
  getMysqlConnection()
    .then((connection) =>
      insertRevenueFromStripe({ id, connection }).then(() =>
        connection.destroy()
      )
    )
    .then(() => ({
      success: true,
    }));

export const handler = createAPIGatewayProxyHandler(logic);
