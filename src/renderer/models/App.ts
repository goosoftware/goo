import { onSnapshot, types } from "mobx-state-tree";
import AnchorWorkspace from "./AnchorWorkspace";

export const App = types
  .model({
    anchorWorkspaces: types.map(AnchorWorkspace),
  })
  .actions((self) => ({
    addWorkspace(workspace: string) {
      // const program = anchor.workspace[workspace];
      self.anchorWorkspaces.put({ id: workspace, name: workspace });
    },
    removeWorkspace(workspace) {
      self.anchorWorkspaces.delete(workspace.id);
    },
  }));

const getData = () => {
  try {
    if (localStorage.getItem("snapshot2")) {
      return JSON.parse(localStorage.getItem("snapshot2"));
    }
  } catch (err) {
    console.error(err);
  }
  return {
    anchorWorkspaces: {},
  };
};

export const app = App.create(getData());

onSnapshot(app, (snapshot) => {
  localStorage.setItem("snapshot2", JSON.stringify(snapshot));
});
