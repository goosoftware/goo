import { Keypair } from "@solana/web3.js";
import { useEffect, useState } from "react";

const useAnchor = () => {
  const [user, setUser] = useState<Keypair>();

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
  }, []);

  return { user };
};

export default useAnchor;
