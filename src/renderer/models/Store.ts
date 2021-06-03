import { flow, onSnapshot, types } from "mobx-state-tree";
import natsort from "natsort";
import AnchorWorkspace, { findWorkspaces } from "./AnchorWorkspace";
import Connection from "./Connection";

const sorter = natsort();
const sortByName = (a, b) => sorter(a.id, b.id);

const Store = types
  .model({
    connection: Connection,
    anchorWorkspaces: types.map(AnchorWorkspace),
  })
  .views((self) => ({
    get sortedWorkspaces() {
      return [...store.anchorWorkspaces.values()].sort(sortByName);
    },
  }))
  .actions((self) => ({
    addFile: flow(function* (file: File) {
      if (file.type !== "") return;
      const workspaces = yield findWorkspaces(file.path);
      workspaces.forEach(([id, address]) => {
        self.anchorWorkspaces.put({
          id,
          address,
          path: file.path,
        });
      });
    }),
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
