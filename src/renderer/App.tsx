import React from "react";
import ClusterSelector from "./components/ClusterSelector";
import Workspaces from "./components/Workspaces";
import Editor from "./Editor";
import "./lib/setup";
import useAnchor from "./lib/useAnchor";

export function App() {
  const { user } = useAnchor();

  return (
    <div>
      <header>
        {user?.publicKey.toString()}
        <ClusterSelector />
      </header>
      <div>
        <Editor />
      </div>
      <Workspaces />
    </div>
  );
}
