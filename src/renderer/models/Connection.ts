import { exec, spawn } from "child_process";
import { flow, types } from "mobx-state-tree";

const Connection = types
  .model({
    cluster: "localnet",
    pid: types.maybeNull(types.number),
    state: types.optional(
      types.enumeration([
        "checking",
        "connecting",
        "connected",
        "disconnected",
        "error",
      ]),
      "checking"
    ),
  })
  .views((self) => ({
    get color(): string {
      switch (self.state) {
        case "connected":
          return "green";
        case "connecting":
          return "orange";
        case "disconnected":
          return "red";
        default:
          return "white";
      }
    },
  }))
  .actions((self) => ({
    afterCreate: flow(function* () {
      if (self.state === "checking") {
        try {
          const pid = yield checkIfConnected();
          self.pid = pid;
          self.state = "connected";
        } catch (err) {
          self.state = "disconnected";
        }
      }
    }),

    connect: flow(function* () {
      if (self.state !== "disconnected") throw "not disconnected";

      self.state = "connecting";
      try {
        const pid = yield connect(self);
        self.pid = pid;
        self.state = "connected";
      } catch (err) {
        self.state = "error";
      }
    }),

    disconnect: flow(function* () {
      if (self.state !== "connected") throw "not connected";
      try {
        yield disconnect(self.pid);
        self.pid = undefined;
        self.state = "disconnected";
      } catch (err) {
        self.state = "error";
      }
    }),
  }));

function checkIfConnected(): Promise<number> {
  return new Promise((res, rej) =>
    exec("pgrep solana-test-validator")
      .stdout.on("data", (data) => {
        console.log({ data });
        const maybePid = parseInt(data, 10);
        if (maybePid > 0) {
          return res(maybePid);
        }
      })
      .on("close", () => rej("no pid found"))
  );
}

function disconnect(pid: number) {
  return new Promise((res, rej) =>
    exec(`kill ${pid}`)
      .on("close", res)
      .on("error", (error) => {
        rej(error.message);
      })
  );
}

function connect(connection): Promise<number> {
  return new Promise((res, rej) => {
    const child = spawn("solana-test-validator");

    child.stdout.on("data", (data) => {
      console.log(`stdout:\n${data}`);
      res(child.pid);
    });

    child.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    // child.on("spawn", (data) => {
    //   console.log("spawn");
    //   res(child.pid);
    // });

    child.on("error", (error) => {
      console.error(error.message);
      rej(error.message);
    });

    child.on("close", (code) => {
      console.error(`child process exited with code ${code}`);
      connection.disconnect();
    });

    child.on("disconnect", () => {
      // console.log("disconnect");
    });
  });
}

export default Connection;
