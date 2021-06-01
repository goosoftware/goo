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
            {workspace.name} <button onClick={workspace.remove}>x</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default observer(Workspaces);
