import { createMintAndVault, createTokenAccount } from "@project-serum/common";
import { LGraphNode, LiteGraph } from "litegraph.js";

class SerumNode extends LGraphNode {
  static title_color = "#007775";
}

class CreateMintAndVault extends SerumNode {
  title = "serum / create mint and vault";

  constructor() {
    super();
    this.addInput("provider", 0 as any);
    this.addInput("amount", 0 as any);
    this.addInput("owner?", 0 as any);
    this.addInput("decimals?", 0 as any);

    this.addOutput("mintPublicKey", 0 as any);
    this.addOutput("vaultPublicKey", 0 as any);

    // this.size[0] = 300;
  }

  onExecute() {
    try {
      createMintAndVault(
        this.getInputData(0),
        this.getInputData(1),
        this.getInputData(2),
        this.getInputData(3)
      )
        .then(([mintPk, vaultPk]) => {
          this.setOutputData(0, mintPk);
          this.setOutputData(1, vaultPk);
        })
        .catch((err) => {});
    } catch (err) {}
  }
}

LiteGraph.registerNodeType("serum/createMintAndVault", CreateMintAndVault);

class CreateTokenAccount extends SerumNode {
  title = "serum / create token account";

  constructor() {
    super();
    this.addInput("provider", "provider");
    this.addInput("mint", "publicKey");
    this.addInput("owner", "publicKey");

    this.addOutput("", "publicKey");

    this.size[0] = 280;
  }

  onExecute() {
    try {
      createTokenAccount(
        this.getInputData(0),
        this.getInputData(1),
        this.getInputData(2)
      )
        .then((pubKey) => this.setOutputData(0, pubKey))
        .catch((err) => {});
    } catch (err) {}
  }
}

LiteGraph.registerNodeType("serum/createTokenAccount", CreateTokenAccount);
