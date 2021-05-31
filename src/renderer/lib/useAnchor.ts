import { Keypair } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { check } from "tcp-port-used";

const useAnchor = () => {
  const [user, setUser] = useState<Keypair>();
  const [solanaRunningLocally, setSolanaRunningLocally] = useState(false);

  useEffect(() => {
    setUser(
      Keypair.fromSecretKey(
        Buffer.from(
          JSON.parse(
            require("fs").readFileSync(
              require("os").homedir() + "/.config/solana/id.json",
              {
                encoding: "utf-8",
              }
            )
          )
        )
      )
    );

    check(8899, "127.0.0.1").then((inUse) => setSolanaRunningLocally(inUse));
  }, []);

  return { user, solanaRunningLocally };
};

export default useAnchor;
