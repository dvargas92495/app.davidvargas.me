import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import axios from "axios";
import { BadRequestError } from "aws-sdk-plus/dist/errors";
import clerkAuthenticateLambda from "@dvargas92495/api/clerkAuthenticateLambda";

type Workspaces = { data: { id: string; attributes: { name: string } }[] };
type Vars = { data: { id: string; attributes: { key: string } }[] };

const logic = ({
  name,
  token,
  workspaceIds,
  value,
  variables,
}: {
  name?: string;
  workspaceIds?: string[];
  value?: string;
  variables?: { workspaceId: string; variableId: string }[];
  token: string;
}) => {
  const opts = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/vnd.api+json",
    },
  };
  if (name) {
    const getWorkspaces = (page = 1): Promise<Workspaces["data"]> =>
      axios
        .get<Workspaces>(
          `https://app.terraform.io/api/v2/organizations/${encodeURIComponent(
            name
          )}/workspaces?page[number]=${page}`,
          opts
        )
        .then((r) =>
          r.data.data.length === 20
            ? getWorkspaces(page + 1).then((n) => [...r.data.data, ...n])
            : r.data.data
        );
    return getWorkspaces().then((ws) => ({
      workspaces: ws.map((w) => ({
        id: w.id,
        name: w.attributes.name,
        vars: [],
      })),
    }));
  } else if (workspaceIds) {
    return Promise.all(
      workspaceIds.map((id) =>
        axios
          .get<Vars>(
            `https://app.terraform.io/api/v2/workspaces/${id}/vars`,
            opts
          )
          .then((r) => ({
            vars: r.data.data.map((k) => ({
              id: k.id,
              name: k.attributes.key,
            })),
            id,
            name: "",
          }))
      )
    ).then((workspaces) => ({
      workspaces,
    }));
  } else if (value && variables) {
    return Promise.all(
      variables.map((v) =>
        axios.patch<Vars>(
          `https://app.terraform.io/api/v2/workspaces/${v.workspaceId}/vars/${v.variableId}`,
          {
            data: {
              type: "vars",
              id: v.variableId,
              attributes: {
                value,
              },
            },
          },
          opts
        )
      )
    ).then(() => ({ workspaces: [] }));
  } else {
    throw new BadRequestError(`Bad request`);
  }
};

export const handler = clerkAuthenticateLambda(
  createAPIGatewayProxyHandler(logic)
);
export type Handler = typeof logic;
