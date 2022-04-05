import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import axios from "axios";

const logic = () => {
  const opts = {
    headers: {
      Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
      "Notion-Version": "2022-02-22",
    },
  };
  return axios
    .post(
      "https://api.notion.com/v1/databases/7ffde51fceef4c01b12307919d7afb6b/query",
      {
        filter: {
          and: [
            {
              property: "Priority",
              rich_text: { equals: "Critical" },
            },
          ],
        },
      },
      opts
    )
    .then((r) => r.data.results[0].id)
    .then((id) => axios.get(`https://api.notion.com/v1/pages/${id}`, opts))
    .then((r) => ({ name: r.data.properties.Name.title[0].text.content }))
    .catch((e) => {
      return { error: e.response.data };
    });
};

export const handler = createAPIGatewayProxyHandler(logic);
