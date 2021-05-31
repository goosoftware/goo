import * as anchor from "@project-serum/anchor";
import { useEffect, useState } from "react";
import { check } from "tcp-port-used";

const useAnchor = () => {
  const [user, setUser] = useState<anchor.web3.Keypair>();
  const [solanaRunningLocally, setSolanaRunningLocally] = useState(false);

  useEffect(() => {
    setUser(
      anchor.web3.Keypair.fromSecretKey(
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
