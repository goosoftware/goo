import { flow, onSnapshot, types } from "mobx-state-tree";
import AnchorWorkspace, { findWorkspaces } from "./AnchorWorkspace";
import Connection from "./Connection";

const Store = types
  .model({
    connection: Connection,
    anchorWorkspaces: types.map(AnchorWorkspace),
  })
  .actions((self) => ({
    addFile: flow(function* (file: File) {
      if (file.type !== "") return;
      const workspaces = yield findWorkspaces(file.path);
      workspaces.forEach((workspace) => {
        self.anchorWorkspaces.put({
          id: workspace,
        });
      });
    }),
  }));

const KEY = "cache";

const initialData = (() => {
  try {
    const data = JSON.parse(localStorage.getItem(KEY));
    if (Object.keys(data).length > 0) return data;
  } catch (err) {
  } finally {
    return {
      connection: {},
      anchorWorkspaces: {},
    };
  }
})();

export const store = Store.create(initialData);

onSnapshot(store, (snapshot) => {
  localStorage.setItem(KEY, JSON.stringify(snapshot));
});
