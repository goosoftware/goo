import React, { useState } from "react";
import useSolana from "../lib/useSolana";

const Clusters = {
  "mainnet-beta": "mainnet-beta",
  devnet: "devnet",
  testnet: "testnet",
  localnet: "localnet",
};

const ClusterSelector = ({
  cluster = "localnet",
}: {
  cluster?: keyof typeof Clusters;
}) => {
  const { stopValidator, startValidator, connected } = useSolana();
  const [_cluster, setCluster] = useState(cluster);

  return (
    <div>
      <select
        value={_cluster}
        onChange={(e) => setCluster(e.target.value as any)}
      >
        <option value="mainnet-beta">mainnet-beta</option>
        <option value="devnet">devnet</option>
        <option value="testnet">testnet</option>
        <option value="localnet">localnet</option>
      </select>

      {_cluster === "localnet" &&
        (connected ? (
          <>
            <span>🟢</span> <button onClick={stopValidator}>disconnect</button>
          </>
        ) : (
          <>
            <span>🔴</span> <button onClick={startValidator}>connect</button>
          </>
        ))}
    </div>
  );
};

export default ClusterSelector;