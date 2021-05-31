import React from "react";
import ClusterSelector from "./components/ClusterSelector";
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
    </div>
  );
}
