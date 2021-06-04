import { observer } from "mobx-react-lite";
import React from "react";
import { Link } from "react-router-dom";
import { store } from "../models/Store";

const WorkspaceMenu = observer(() => (
  <ul>
    {store.sortedWorkspaces.map((ws) => (
      <li key={ws.id}>
        <Link to={`/workspaces/${ws.id}`}>{ws.id}</Link>
      </li>
    ))}
  </ul>
));

export default WorkspaceMenu;
