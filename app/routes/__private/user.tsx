import React, { useCallback, useMemo, useState } from "react";
import clerkUserProfileCss from "@dvargas92495/ui/utils/clerkUserProfileCss";
import { UserProfile } from "@clerk/remix";
import getMeta from "@dvargas92495/ui/utils/getMeta";
import UserProfileTab from "@dvargas92495/ui/components/UserProfileTab";
import remixAppAction from "@dvargas92495/ui/utils/remixAppAction";
import { ActionFunction, useFetcher } from "remix";
import insertRevenueFromStripe from "~/data/insertRevenueFromStripe.server";
import editTerraformVariable from "~/data/editTerraformVariable.server";

const Terraform = () => {
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
      fetcher.data.workspaces.forEach((w) => formData.append('workspaceIds', w.id))
      formData.append('token', token);
      formData.append('operation', 'terraform');
      fetcher.submit(formData);
    }
  }, [token, fetcher]);
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const filteredWorkspaces = useMemo(
    () =>
    fetcher.data ? fetcher.data.workspaces.filter((w) => !key || w.vars.map((v) => v.name).includes(key)) : [],
    [key, fetcher]
  );
  const fixVariables = useCallback(() => {
    const formData = new FormData();
    filteredWorkspaces.forEach((w) => formData.append('variables', `${w.id}::${w.vars.find((v) => v.name === key)?.id || key}`))
    formData.append('token', token);
    formData.append('value', value);
    formData.append('operation', 'terraform');
    fetcher.submit(formData);
  }, [
    value,
    filteredWorkspaces,
    token,
    key,
  ]);
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

const Stripe = () => {
  return (
    <UserProfileTab
      id={"Stripe"}
      icon={
        <svg
          width="1.25em"
          height="1.25em"
          viewBox="0 0 24 24"
          stroke="currentColor"
          fill="none"
          className="cl-icon"
        >
          <path
            d="M19 5h-2V3c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v2H9V3c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v2H1c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V6c0-.55-.45-1-1-1zM8.71 15.29a1.003 1.003 0 01-1.42 1.42l-4-4C3.11 12.53 3 12.28 3 12s.11-.53.29-.71l4-4a1.003 1.003 0 011.42 1.42L5.41 12l3.3 3.29zm8-2.58l-4 4a1.003 1.003 0 01-1.42-1.42l3.3-3.29-3.29-3.29A.965.965 0 0111 8a1.003 1.003 0 011.71-.71l4 4c.18.18.29.43.29.71s-.11.53-.29.71z"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
      }
      cards={[
        {
          title: "Broadcast",
          description: "Send it.",
        },
      ]}
    />
  );
};

const ConvertKit = () => {
  return (
    <UserProfileTab
      id={"ConvertKit"}
      icon={
        <svg
          width="1.25em"
          height="1.25em"
          viewBox="0 0 24 24"
          stroke="currentColor"
          fill="none"
          className="cl-icon"
        >
          <path
            d="M19 5h-2V3c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v2H9V3c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v2H1c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V6c0-.55-.45-1-1-1zM8.71 15.29a1.003 1.003 0 01-1.42 1.42l-4-4C3.11 12.53 3 12.28 3 12s.11-.53.29-.71l4-4a1.003 1.003 0 011.42 1.42L5.41 12l3.3 3.29zm8-2.58l-4 4a1.003 1.003 0 01-1.42-1.42l3.3-3.29-3.29-3.29A.965.965 0 0111 8a1.003 1.003 0 011.71-.71l4 4c.18.18.29.43.29.71s-.11.53-.29.71z"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
      }
      cards={[
        {
          title: "Broadcast",
          description: "Send it.",
        },
      ]}
    />
  );
};

const UserPage: React.FunctionComponent = () => (
  <div>
    <style>{clerkUserProfileCss}</style>
    <UserProfile />
    <Stripe />
    <Terraform />
    <ConvertKit />
  </div>
);

export const meta = getMeta({
  title: "user",
});

export const action: ActionFunction = (args) => {
  return remixAppAction(args, ({ data }) => {
    const operation = data.operation?.[0];
    if (operation === "stripe") {
      return insertRevenueFromStripe({ id: data.id?.[0] });
    } else if (operation === "terraform") {
      return editTerraformVariable({
        name: data.name?.[0],
        token: data.token?.[0],
        workspaceIds: data.workspaceIds,
        value: data.value?.[0],
        variables: data.variables
          .map((v) => v.split("::"))
          .map(([workspaceId, variableId]) => ({ workspaceId, variableId })),
      });
    } else {
      throw new Error(`Unsupported operation ${operation}`);
    }
  });
};

export default UserPage;
