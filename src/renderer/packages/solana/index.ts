import * as anchor from "@project-serum/anchor";
import { LGraphNode, LiteGraph } from "litegraph.js";

class SolanaNode extends LGraphNode {
  static title_color = "#905ea9";
}

class GenerateKeypair extends SolanaNode {
  title = "solana / generate keypair";
  private keypair = anchor.web3.Keypair.generate();

  constructor() {
    super();
    // this.addInput("keypair", 0 as any);

    this.addOutput("keypair", 0 as any);
    this.addOutput("publicKey", 0 as any);
    this.addOutput("secretKey", 0 as any);
  }

  onExecute() {
    this.setOutputData(0, this.keypair);
    this.setOutputData(1, this.keypair.publicKey.toString());
    this.setOutputData(2, this.keypair.secretKey);
  }
}
LiteGraph.registerNodeType(`solana/generateKeypair`, GenerateKeypair);

class SYSVARS extends SolanaNode {
  title = "solana / SYSVARS";
  constructor() {
    super();
    this.addOutput("CLOCK", "publicKey");
    this.addOutput("INSTRUCTIONS", "publicKey");
    this.addOutput("RECENT_BLOCKHASHES", "publicKey");
    this.addOutput("RENT", "publicKey");
    this.addOutput("REWARDS", "publicKey");
    this.addOutput("STAKE_HISTORY", "publicKey");
  }
  onExecute() {
    this.setOutputData(0, anchor.web3.SYSVAR_CLOCK_PUBKEY);
    this.setOutputData(1, anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY);
    this.setOutputData(2, anchor.web3.SYSVAR_RECENT_BLOCKHASHES_PUBKEY);
    this.setOutputData(3, anchor.web3.SYSVAR_RENT_PUBKEY);
    this.setOutputData(4, anchor.web3.SYSVAR_REWARDS_PUBKEY);
    this.setOutputData(5, anchor.web3.SYSVAR_STAKE_HISTORY_PUBKEY);
  }
}
LiteGraph.registerNodeType(`solana/SYSVARS`, SYSVARS);
