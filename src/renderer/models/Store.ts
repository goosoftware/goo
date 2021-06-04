import { web3 } from "@project-serum/anchor";
import { Keypair } from "@solana/web3.js";
import { readFileSync } from "fs";
import { flow, onSnapshot, types } from "mobx-state-tree";
import natsort from "natsort";
import { homedir } from "os";
import AnchorWorkspace, { findWorkspaces } from "./AnchorWorkspace";
import Connection from "./Connection";

const sorter = natsort();
const sortByName = (a, b) => sorter(a.id, b.id);

const Store = types
  .model({
    connection: Connection,
    anchorWorkspaces: types.map(AnchorWorkspace),
  })
  .volatile((): { user: Keypair } => ({
    user: undefined,
  }))
  .views((self) => ({
    get sortedWorkspaces() {
      return [...store.anchorWorkspaces.values()].sort(sortByName);
    },
    get userPublicKey() {
      return self.user?.publicKey?.toString();
    },
    get shortUserPublicKey() {
      const key = self.user?.publicKey?.toString();
      if (key) {
        return [key.slice(0, 4), key.slice(-4)].join("...");
      }
    },
  }))
  .actions((self) => ({
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
    },
  }));

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
