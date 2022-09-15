import axios from "axios";
import createAPIGatewayProxyHandler from "~/package/backend/createAPIGatewayProxyHandler.server";
import getMysqlConnection from "~/package/backend/mysql.server";

const getLastWeeksValue = async (source: string, requestId: string) => {
  const cxn = await getMysqlConnection(requestId);
  const [results] = await cxn.execute(
    `SELECT s.snapshot FROM reports r
  INNER JOIN report_sources s ON s.report_uuid = r.uuid
  WHERE s.source = ?
  ORDER BY r.end DESC
  LIMIT 1`,
    [source]
  );
  return (results as { snapshot: number }[])[0]?.snapshot || 0;
};

const logic = ({
  source,
  requestId,
}: {
  source: string;
  requestId: string;
}) => {
  switch (source) {
    case "citi-checking": {
      return {
        amount: 200000,
      };
    }
    case "ethereum-wallet": {
      return axios
        .get(
          `https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD&api_key=${process.env.CRYPTO_COMPARE_API}`
        )
        .then((r) => ({ amount: r.data.USD * 3 }));
    }
    case "mercury-checking": {
      const opts = {
        headers: { Authorization: `Bearer ${process.env.MERCURY_TOKEN}` },
      };
      return axios
        .get("https://backend.mercury.com/api/v1/accounts", opts)
        .then((r) => r.data.accounts[0].availableBalance)
        .then((amount) => ({ amount }));
    }
    case "splitwise": {
      const opts = {
        headers: { Authorization: `Bearer ${process.env.SPLITWISE_TOKEN}` },
      };
      return axios
        .get("https://secure.splitwise.com/api/v3.0/get_current_user", opts)
        .then((r) => r.data.user.id)
        .then((me) =>
          axios
            .get<{
              groups: {
                simplified_debts: {
                  from: string;
                  amount: number;
                  to: string;
                }[];
              }[];
            }>("https://secure.splitwise.com/api/v3.0/get_current_user", opts)
            .then((r) =>
              r.data.groups
                .filter((g) => g.simplified_debts.length)
                .reduce((p, c) => {
                  return (
                    p +
                    c.simplified_debts.reduce((prev, cur) => {
                      let total = prev;
                      if (cur.from === me) {
                        total -= Number(cur.amount);
                      }
                      if (cur.to === me) {
                        total += Number(cur.amount);
                      }
                      return total;
                    }, 0)
                  );
                }, 0)
            )
            .then((amount) => ({ amount }))
        );
    }
    case "wefunder": {
      return {
        amount: 100000,
      };
    }
    default: {
      return getLastWeeksValue(source, requestId).then((amount) => ({
        amount,
      }));
    }
  }
};

export const handler = createAPIGatewayProxyHandler({ logic });
