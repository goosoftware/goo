import * as anchor from "@project-serum/anchor";
import { onSnapshot, types } from "mobx-state-tree";
import AnchorWorkspace from "./AnchorWorkspace";

export const App = types
  .model({
    anchorWorkspaces: types.map(AnchorWorkspace),
  })
  .actions((self) => ({
    addWorkspace(workspace: string) {
      const program = anchor.workspace[workspace];
      self.anchorWorkspaces.put({ id: workspace, name: workspace });
    },
    removeWorkspace(workspace) {
      self.anchorWorkspaces.delete(workspace.id);
    },
  }));

const getData = () => {
  try {
    if (!localStorage.getItem("snapshot")) throw "no snapshot";
    return JSON.parse(localStorage.getItem("snapshot"));
  } catch (err) {
    console.error(err);
    return {
      anchorWorkspaces: {},
    };
  }
};

export const app = App.create(getData());

onSnapshot(app, (snapshot) => {
  localStorage.setItem("snapshot", JSON.stringify(snapshot));
});
