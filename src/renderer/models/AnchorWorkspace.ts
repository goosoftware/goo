import { getParent, types } from "mobx-state-tree";

const AnchorWorkspace = types
  .model({
    id: types.identifier,
    name: types.string,
  })
  .actions((self) => ({
    remove() {
      (getParent(self, 2) as any).removeWorkspace(self);
    },
  }));

export default AnchorWorkspace;
