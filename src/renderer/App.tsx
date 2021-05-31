import React from "react";
import ClusterSelector from "./components/ClusterSelector";
import useAnchor from "./lib/useAnchor";

export function App() {
  const { user } = useAnchor();

  return (
    <div>
      <header>
        {user?.publicKey.toString()}

        <ClusterSelector />
      </header>
    </div>
  );
}
