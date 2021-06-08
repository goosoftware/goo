import { GooNode } from "@goosoftware/goo";
import * as anchor from "@project-serum/anchor";
import { LiteGraph } from "litegraph.js";

const provider = anchor.Provider.local();

class AnchorNode extends GooNode {
  static title_color = "#3694E0";
}

class ProviderWallet extends AnchorNode {
  title = "anchor / provider wallet";
  constructor() {
    super();
    this.addOutput("wallet", 0 as any);
    this.addOutput("publicKey", 0 as any);
  }
  onExecute() {
    this.setOutputData(0, provider.wallet);
    this.setOutputData(0, provider.wallet.publicKey);
  }
}
LiteGraph.registerNodeType(`anchor/providerWallet`, ProviderWallet);
