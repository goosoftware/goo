import { types } from "mobx-state-tree";
import Workspace from "./Workspace";

export const App = types.model({
  workspaces: types.optional(types.array(Workspace), []),
});

export const app = App.create({
  workspaces: [{ name: "Chat" }],
});
