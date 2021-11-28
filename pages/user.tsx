import React, { useCallback, useMemo, useState } from "react";
import Layout, { LayoutHead } from "./_common/Layout";
import RedirectToLogin from "@dvargas92495/ui/dist/components/RedirectToLogin";
import clerkUserProfileCss from "@dvargas92495/ui/dist/clerkUserProfileCss";
import useAuthenticatedHandler from "@dvargas92495/ui/dist/useAuthenticatedHandler";
import { SignedIn, UserProfile } from "@clerk/clerk-react";
import type { Handler as TerraformHandler } from "../functions/terraform/post";

const HackyDashboard = () => {
  const postTerraform = useAuthenticatedHandler<TerraformHandler>({
    method: "POST",
    path: "terraform",
  });
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [workspaces, setWorkspaces] = useState<
    Awaited<ReturnType<TerraformHandler>>["workspaces"]
  >([]);
  const refresh = useCallback(() => {
    postTerraform({ name, token }).then((ws) => setWorkspaces(ws.workspaces));
  }, [postTerraform, setWorkspaces, name, token]);
  const listVariables = useCallback(() => {
    postTerraform({
      workspaceIds: workspaces.map((w) => w.id),
      token,
    }).then((ws) => {
      const varsById = Object.fromEntries(
        ws.workspaces.map((w) => [w.id, w.vars])
      );
      setWorkspaces(workspaces.map((w) => ({ ...w, vars: varsById[w.id] })));
    });
  }, [postTerraform, setWorkspaces, workspaces, token]);
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const filteredWorkspaces = useMemo(
    () =>
      workspaces.filter((w) => !key || w.vars.map((v) => v.name).includes(key)),
    [key, workspaces]
  );
  const fixVariables = useCallback(() => {
    postTerraform({
      value,
      variables: filteredWorkspaces.map((w) => ({
        workspaceId: w.id,
        variableId: w.vars.find((v) => v.name === key)?.id || key,
      })),
      token,
    }).then(() => {
      setKey("");
      setValue("");
    });
  }, [
    postTerraform,
    setWorkspaces,
    value,
    filteredWorkspaces,
    token,
    key,
    setKey,
    setValue,
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

const UserPage: React.FunctionComponent = () => (
  <Layout>
    <SignedIn>
      <div>
        <HackyDashboard />
        <UserProfile />
      </div>
    </SignedIn>
    <RedirectToLogin />
  </Layout>
);

export const Head = (): React.ReactElement => (
  <LayoutHead title={"User"} styles={clerkUserProfileCss} />
);
export default UserPage;
