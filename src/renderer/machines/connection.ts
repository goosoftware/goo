import { Machine } from "xstate";

const connectionMachine = Machine({
  id: "connection",
  initial: "checking",
  states: {
    checking: {
      on: {
        IS_CONNECTED: "connected",
        IS_DISCONNECTED: "disconnected",
      },
    },
    disconnected: {
      on: {
        CONNECT: "connected",
      },
    },
    connected: {
      on: {
        DISCONNECT: "disconnected",
      },
    },
  },
});

export default connectionMachine;
