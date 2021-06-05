import { observer } from "mobx-react-lite";
import React from "react";
import useAnchor from "../lib/useAnchor";
import { app } from "../models/App";
import Link from "./ExternalLink";

const Workspaces = () => {
  const { deploy } = useAnchor();
  return (
    <div id="workspaces">
      <h1 className="text-base md:text-lg font-black">Workspaces</h1>
      <ul>
        {[...app.anchorWorkspaces.values()].map((workspace) => (
          <li key={workspace.id}>
            <h3>
              {workspace.address ? (
                <Link
                  href={`https://explorer.solana.com/address/${workspace.address}?cluster=custom&customUrl=http://localhost:8899`}
                >
                  {workspace.name}
                </Link>
              ) : (
                workspace.name
              )}

              <button onClick={workspace.remove}>x</button>
              <button onClick={deploy}>deploy</button>
            </h3>

            <ul>
              {workspace.nodes.map((node) => (
                <li key={node}>{node}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default observer(Workspaces);
