import React from "react";
import useAnchor from "./lib/useAnchor";

export function App() {
  const { user } = useAnchor();

  return (
    <div className="padding">
      <h2>{user?.publicKey.toString()}</h2>
    </div>
  );
}
