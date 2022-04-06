import remixAppAction from "@dvargas92495/ui/utils/remixAppAction.server";
import React from "react";
import { useState, useCallback, useMemo } from "react";
import { ActionFunction, useFetcher } from "remix";
import editTerraformVariable from "~/data/editTerraformVariable.server";

const UserTerraform = () => {
  const fetcher =
    useFetcher<Awaited<ReturnType<typeof editTerraformVariable>>>();
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const refresh = useCallback(() => {
    fetcher.submit({ name, token, operation: "terraform" });
  }, [name, token]);
  const listVariables = useCallback(() => {
    if (fetcher.data) {
      const formData = new FormData();
      fetcher.data.workspaces.forEach((w) =>
        formData.append("workspaceIds", w.id)
      );
      formData.append("token", token);
      formData.append("operation", "terraform");
      fetcher.submit(formData);
    }
  }, [token, fetcher]);
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const filteredWorkspaces = useMemo(
    () =>
      fetcher.data
        ? fetcher.data.workspaces.filter(
            (w) => !key || w.vars.map((v) => v.name).includes(key)
          )
        : [],
    [key, fetcher]
  );
  const fixVariables = useCallback(() => {
    const formData = new FormData();
    filteredWorkspaces.forEach((w) =>
      formData.append(
        "variables",
        `${w.id}::${w.vars.find((v) => v.name === key)?.id || key}`
      )
    );
    formData.append("token", token);
    formData.append("value", value);
    formData.append("operation", "terraform");
    fetcher.submit(formData);
  }, [value, filteredWorkspaces, token, key]);
  const [action, setAction] = useState(0);
  const actions = [refresh, listVariables, fixVariables];
  return (
    <div style={{ marginBottom: 64 }}>
      <h1>Terraform</h1>
      <div style={{ display: "flex", marginBottom: 16 }}>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <input value={token} onChange={(e) => setToken(e.target.value)} />
        <select
          value={action}
          onChange={(e) => setAction(Number(e.target.value))}
        >
          <option value={0}>Refresh</option>
          <option value={1}>List Variables</option>
          <option value={2}>Bulk Update Variable</option>
        </select>
        <button onClick={actions[action]}>Go</button>
      </div>
      <div style={{ display: "flex", marginBottom: 16 }}>
        {action === 2 && (
          <input value={key} onChange={(e) => setKey(e.target.value)} />
        )}
        {action === 2 && (
          <input value={value} onChange={(e) => setValue(e.target.value)} />
        )}
      </div>
      {!!filteredWorkspaces.length && (
        <>
          <h3>Workspaces:</h3>
          <ul>
            {filteredWorkspaces.map((w) => (
              <li key={w.id}>
                {w.name}
                {!!w.vars.length && (
                  <ul>
                    {w.vars.map((v) => (
                      <li key={v.id}>{v.name}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};
export const action: ActionFunction = (args) => {
  return remixAppAction(args, ({ data }) => {
    return editTerraformVariable({
      name: data.name?.[0],
      token: data.token?.[0],
      workspaceIds: data.workspaceIds,
      value: data.value?.[0],
      variables: data.variables
        .map((v) => v.split("::"))
        .map(([workspaceId, variableId]) => ({ workspaceId, variableId })),
    });
  });
};

export default UserTerraform;
