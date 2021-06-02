import { Machine } from "xstate";

export default Machine({
  id: "workspace",
  initial: "imported",
  states: {
    imported: {
      on: {
        IS_UNBUILT: "unbuilt",
        IS_BUILT: "built",
        IS_DEPLOYED: "deployed",
      },
    },
    unbuilt: {
      on: {
        BUILD: "built",
        FAIL: "failure",
      },
    },
    built: {
      on: {
        DEPLOY: "deployed",
        CHANGE: "unbuilt",
      },
    },
    deployed: {
      type: "final",
      on: {
        CHANGE: "unbuilt",
      },
    },
    failure: {},
  },
});
