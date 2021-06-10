import { GooNode } from "@goosoftware/goo";
import * as anchor from "@project-serum/anchor";
import { LiteGraph } from "litegraph.js";

class SolanaNode extends GooNode {
  static title_color = "#905ea9";
}

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

class SYSVARS extends SolanaNode {
  title = "solana / SYSVARS";

  constructor() {
    super();
    this.addOutput("CLOCK", "publicKey", { shape: LiteGraph.ARROW_SHAPE });
    this.addOutput("INSTRUCTIONS", "publicKey", {
      shape: LiteGraph.ARROW_SHAPE,
    });
    this.addOutput("RECENT_BLOCKHASHES", "publicKey", {
      shape: LiteGraph.ARROW_SHAPE,
    });
    this.addOutput("RENT", "publicKey", { shape: LiteGraph.ARROW_SHAPE });
    this.addOutput("REWARDS", "publicKey", { shape: LiteGraph.ARROW_SHAPE });
    this.addOutput("STAKE_HISTORY", "publicKey", {
      shape: LiteGraph.ARROW_SHAPE,
    });
  }

  run() {
    this.setOutputData(0, anchor.web3.SYSVAR_CLOCK_PUBKEY);
    this.setOutputData(1, anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY);
    this.setOutputData(2, anchor.web3.SYSVAR_RECENT_BLOCKHASHES_PUBKEY);
    this.setOutputData(3, anchor.web3.SYSVAR_RENT_PUBKEY);
    this.setOutputData(4, anchor.web3.SYSVAR_REWARDS_PUBKEY);
    this.setOutputData(5, anchor.web3.SYSVAR_STAKE_HISTORY_PUBKEY);
  }
}
LiteGraph.registerNodeType(`solana/SYSVARS`, SYSVARS);
