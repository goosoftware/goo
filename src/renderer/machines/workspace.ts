import { Machine } from "xstate";

const workspaceMachine = Machine({
  id: "workspace",
  initial: "imported",
  states: {
    imported: {
      on: {
        CHECK: "checking",
      },
    },
    checking: {
      on: {
        IS_UNBUILT: "unbuilt",
        IS_BUILT: "built",
        IS_DEPLOYED: "deployed",
      },
    },
    unbuilt: {
      on: {
        BUILD: "built",
        FAIL: "failure.build",
      },
    },
    built: {
      on: {
        DEPLOY: "deployed",
        FAIL: "failure.deploy",
        CHANGE: "unbuilt",
      },
    },
    deployed: {
      type: "final",
      on: {
        CHANGE: "unbuilt",
      },
    },
    failure: {
      states: {
        build: {
          meta: { message: "build failure" },
        },
        deploy: {
          meta: { message: "deploy failure" },
        },
      },
    },
  },
});

export default workspaceMachine;
