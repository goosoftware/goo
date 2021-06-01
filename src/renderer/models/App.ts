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

const LOCAL_KEY = "snapshot4";

const getData = () => {
  try {
    const data = JSON.parse(localStorage.getItem(LOCAL_KEY));
    if (data?.anchorWorkspaces) return data;
  } catch (err) {}

  return {
    anchorWorkspaces: {},
  };
};

export const app = App.create(getData());

onSnapshot(app, (snapshot) => {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(snapshot));
});
