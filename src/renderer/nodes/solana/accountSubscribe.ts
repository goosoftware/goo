import { LiteGraph } from "litegraph.js";
import { store } from "models/Store";
import { SolanaNode } from "./_base";

class AccountSubscribe extends SolanaNode {
  private socket = new WebSocket(
    store.clusterUrl(store.cluster).replace("http", "ws")
  );
  title = "solana / watch account";
  // static size = [230, 40];

  constructor() {
    super();
    this.addInput("address", "publicKey", { shape: LiteGraph.ARROW_SHAPE });
    this.addOutput("trigger", LiteGraph.EVENT);

    this.socket.onmessage = (ev) => {
      const data = JSON.parse(ev.data);
      if (data.id !== 2) {
        this.triggerSlot(0, true);
      }
    };

    this.socket.onopen = () => {
      this.bgcolor = "green";
    };
    this.socket.onerror = () => {
      this.bgcolor = "red";
    };
    this.socket.onclose = () => {
      this.bgcolor = "";
    };
  }

  run() {
    if (this.getInputData(0)) {
      this.wsSend(
        JSON.stringify({
          jsonrpc: "2.0",
          method: "accountSubscribe",
          id: 1,
          params: [
            this.getInputData(0).toString(),
            {
              encoding: "base64",
              // commitment: "finalized",
            },
          ],
        })
      );
    }

    setInterval(() => {
      this.wsSend(
        JSON.stringify({
          jsonrpc: "2.0",
          method: "ping",
        })
      );
    }, 5000);
  }

  private waitForConnection(callback: any, interval: number) {
    if (this.socket.readyState === 1) {
      callback();
    } else {
      setTimeout(() => {
        this.waitForConnection(callback, interval);
      }, interval);
    }
  }

  private wsSend(message: string) {
    this.waitForConnection(() => {
      this.socket.send(message);
    }, 500);
  }
}

LiteGraph.registerNodeType("solana/accountSubscribe", AccountSubscribe);
