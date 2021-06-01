import { types } from "mobx-state-tree";

const Workspace = types.model({
  name: types.string,
});

export default Workspace;
