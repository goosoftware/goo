import { web3 } from "@project-serum/anchor";
import { Keypair } from "@solana/web3.js";
import { exec } from "child_process";
import { readFileSync } from "fs";
import { flow, onSnapshot, types } from "mobx-state-tree";
import natsort from "natsort";
import { homedir } from "os";
import { promisify } from "util";
import AnchorWorkspace, { findWorkspaces } from "./AnchorWorkspace";
import Connection from "./Connection";

const sorter = natsort();
const sortByName = (a, b) => sorter(a.id, b.id);

const Store = types
  .model({
    connection: Connection,
    anchorWorkspaces: types.map(AnchorWorkspace),
    cluster: types.optional(
      types.enumeration(["local", "dev", "test", "main"]),
      "local"
    ),
  })
  .volatile((): {
    user?: Keypair;
    solanaCliVersion?: string;
    anchorCliVersion?: string;
  } => ({}))
  .views((self) => ({
    get sortedWorkspaces() {
      return [...store.anchorWorkspaces.values()].sort(sortByName);
    },
    get userPublicKey() {
      return self.user?.publicKey?.toString();
    },
    get shortUserPublicKey() {
      const key = self.user?.publicKey?.toString();
      const numChars = 10;
      if (key) {
        return [key.slice(0, numChars / 2), key.slice(-numChars / 2)].join(
          "..."
        );
      }
    },
    explorerUrl(path: string) {
      return `https://explorer.solana.com/${path}?cluster=${clusterUrlName(
        self.cluster
      )}&customUrl=http://localhost:8899`;
    },
  }))
  .actions((self) => ({
    changeCluster(cluster: typeof self.cluster) {
      self.cluster = cluster;
    },
    addFile: flow(function* (file: File) {
      if (file.type !== "") return;
      const workspaces = yield findWorkspaces(file.path);
      workspaces.forEach(([id, idl]) => {
        self.anchorWorkspaces.put({
          id,
          idl,
          path: file.path,
        });
      });
    }),
    afterCreate() {
      self.user = web3.Keypair.fromSecretKey(
        Buffer.from(
          JSON.parse(
            readFileSync(homedir() + "/.config/solana/id.json", {
              encoding: "utf-8",
            })
          )
        )
      );
      console.log(self.user);

      promisify(exec)("solana --version").then(({ stdout }) => {
        (self as any).set("solanaCliVersion", stdout.trim());
      });

      promisify(exec)("anchor --version").then(({ stdout }) => {
        (self as any).set("anchorCliVersion", stdout.trim());
      });
    },
    removeWorkspace(workspaceId: string) {
      self.anchorWorkspaces.delete(workspaceId);
    },
    set(key, value) {
      self[key] = value;
    },
  }));

const clusterUrlName = (cluster): string => {
  switch (cluster) {
    case "test":
      return "testnet";
    case "dev":
      return "devnet";
    case "local":
      return "custom";
    default:
      return "";
  }
};

const KEY = "cache";

export const store = (() => {
  try {
    const data = JSON.parse(localStorage.getItem(KEY));
    if (Object.keys(data).length > 0) return Store.create(data);
  } catch (err) {}
  return Store.create({
    connection: {},
    anchorWorkspaces: {},
  });
})();

onSnapshot(store, (snapshot) => {
  localStorage.setItem(KEY, JSON.stringify(snapshot));
});
