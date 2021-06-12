import { LiteGraph } from "litegraph.js";
import { SolanaNode } from "./_base";

class RequestAirdrop extends SolanaNode {
  title = "solana / request airdrop";

  constructor() {
    super();
    this.addInput("address", "publicKey", {
      shape: LiteGraph.ARROW_SHAPE,
    });
    this.addInput("amount", "number");
    // this.addInput("commitment?", "object");
    this.addInput("trigger", LiteGraph.EVENT);
    this.addOutput("signature", "string", { label: "" });
  }

  onAction() {
    const address = this.getInputData(0)?.toString();
    const amount = this.getInputData(1);
    this.send({
      method: "requestAirdrop",
      params: [String(address), Number(amount) * 10 ** 9],
    });
  }
}

LiteGraph.registerNodeType("solana/requestAirdrop", RequestAirdrop);
