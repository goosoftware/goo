import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import { useState } from "react";

const useSolana = () => {
  const [localValidator, setLocalValidator] =
    useState<ChildProcessWithoutNullStreams>();
  const [connected, setConnected] = useState<Boolean>();

  const startValidator = () => {
    const child = spawn("solana-test-validator");

    child.stdout.on("data", (data) => {
      if (!connected) setConnected(true);
      console.log(`stdout:\n${data}`);
    });

    child.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    child.on("error", (error) => {
      console.error(`error: ${error.message}`);
    });

    child.on("close", (code) => {
      console.log(`child process exited with code ${code}`);
      setConnected(false);
    });

    child.on("disconnect", () => {
      setConnected(false);
    });

    setLocalValidator(child);
  };

  const stopValidator = () => {
    localValidator?.kill();
    // kill $(lsof -ti:8899)
  };

  return { stopValidator, startValidator, localValidator, connected };
};

export default useSolana;
