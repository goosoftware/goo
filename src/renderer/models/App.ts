import { types } from "mobx-state-tree";
import AnchorWorkspace from "./AnchorWorkspace";

export const App = types
  .model({
    anchorWorkspaces: types.optional(types.array(AnchorWorkspace), []),
  })
  .actions((self) => ({
    addWorkspace(workspace) {
      self.anchorWorkspaces.push(workspace);
    },
  }));

export const app = App.create({
  anchorWorkspaces: [{ name: "Chat" }],
});
