import * as anchor from "@project-serum/anchor";
import { LiteGraph } from "litegraph.js";
import { SolanaNode } from "./_base";

class GenerateKeypair extends SolanaNode {
  title = "solana / generate keypair";
  private keypair = anchor.web3.Keypair.generate();

  constructor() {
    super();
    this.addOutput("keypair", 0 as any);
    this.addOutput("publicKey", "publicKey", { shape: LiteGraph.ARROW_SHAPE });
    this.addOutput("secretKey", 0 as any);
  }

  run() {
    this.setOutputData(0, this.keypair);
    // this.setOutputData(1, this.keypair.publicKey.toString());
    this.setOutputData(1, this.keypair.publicKey);
    this.setOutputData(2, this.keypair.secretKey);
  }
}
LiteGraph.registerNodeType(`solana/generateKeypair`, GenerateKeypair);
