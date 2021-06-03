import * as anchor from "@project-serum/anchor";
import { spawn } from "child_process";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { check } from "tcp-port-used";

const useAnchor = () => {
  const [user, setUser] = useState<anchor.web3.Keypair>();
  const [solanaRunningLocally, setSolanaRunningLocally] = useState(false);

  const deploy = () => {
    // const child = spawn(`cd '${process.env.PROJECT_ROOT}' && anchor deploy`, {
    //   shell: true,
    // });

    // https://www.freecodecamp.org/news/node-js-child-processes-everything-you-need-to-know-e69498fe970a/
    const child = spawn(`anchor deploy`, {
      cwd: process.env.PROJECT_ROOT,
      shell: true,
      // stdio: "inherit",
      // env: { PROJECT_ROOT: process.env.PROJECT_ROOT },
      // detached: true
    });

    child.stdout.on("data", (data) => {
      console.log(`stdout:\n${data}`);
      if (String(data).includes("success")) {
        toast.success(String(data));
      } else {
        toast.info(String(data));
      }
    });

    child.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
      toast.error(String(data));
    });

    child.on("error", (error) => {
      console.error(`error: ${error.message}`);
      toast.error(String(error.message));
    });

    // calls exit and then close
    child.on("exit", () => {
      console.log("EXIT");
    });

    child.on("close", () => {
      console.log("CLOSE");
      // toast.success("deployed");
    });

    child.on("disconnect", () => {
      console.log("disconnect");
    });
  };

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

  return { user, solanaRunningLocally, deploy };
};

export default useAnchor;
