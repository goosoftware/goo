import { observer } from "mobx-react-lite";
import React from "react";
import { app } from "../models/App";

const Workspaces = () => {
  return (
    <div id="workspaces">
      <h1>Workspaces</h1>
      <ul>
        {[...app.anchorWorkspaces.values()].map((workspace) => (
          <li key={workspace.id}>
            <h3>
              {workspace.name} <button onClick={workspace.remove}>x</button>
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
