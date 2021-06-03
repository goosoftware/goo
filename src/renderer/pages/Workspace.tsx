import { observer } from "mobx-react-lite";
import React from "react";
import { Redirect, useParams } from "react-router-dom";
import { store } from "../models/Store";

const Workspace = () => {
  let { id } = useParams<{ id: string }>();

  const workspace = store.anchorWorkspaces.get(id);

  if (!workspace) return <Redirect to="/" />;

  return (
    <div>
      <h3>ID: {id}</h3>
      <pre>{JSON.stringify(workspace.toJSON(), null, 2)}</pre>
      {!workspace.address && <button disabled>deploy</button>}
    </div>
  );
};

export default observer(Workspace);
