import { observer } from "mobx-react-lite";
import React from "react";
import { app } from "../models/App";

const Workspaces = () => {
  return (
    <div id="workspaces">
      <h1>Workspaces</h1>
      <ul>
        {app.anchorWorkspaces.map((workspace) => (
          <li>{workspace.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default observer(Workspaces);
