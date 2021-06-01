import * as anchor from "@project-serum/anchor";
import { types } from "mobx-state-tree";
import AnchorWorkspace from "./AnchorWorkspace";

export const App = types
  .model({
    anchorWorkspaces: types.map(AnchorWorkspace),
  })
  .actions((self) => ({
    addWorkspace(workspace: string) {
      const program = anchor.workspace[workspace];
      console.log({ adding: program });
      self.anchorWorkspaces.put({ id: workspace, name: workspace });
    },
    removeWorkspace(workspace) {
      self.anchorWorkspaces.delete(workspace.id);
    },
  }));

export const app = App.create({
  anchorWorkspaces: {},
});
