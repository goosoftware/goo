import * as anchor from "@project-serum/anchor";
import { createMintAndVault, createTokenAccount } from "@project-serum/common";
import { LGraphNode, LiteGraph } from "litegraph.js";
import get from "lodash/get";
import util from "tweetnacl-util";

// LiteGraph.clearRegisteredTypes();

const provider = anchor.Provider.local();

export class WorkspaceNode extends LGraphNode {
  static title_color = "#0eaf9b";
}

class SolanaNode extends LGraphNode {
  static title_color = "#905ea9";
}

class UtilNode extends LGraphNode {
  static title_color = "#000";
}

class AnchorNode extends LGraphNode {
  static title_color = "#3694E0";
}

class SerumNode extends LGraphNode {
  static title_color = "#007775";
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

class Logger extends UtilNode {
  title = "utils / logger";
  constructor() {
    super();
    this.addInput("data", 0 as any);
  }
  onExecute() {
    console.log(this.getInputData(0));
  }
}
LiteGraph.registerNodeType(`utils/logger`, Logger);

class BigNumber extends UtilNode {
  title = "utils / big number";
  constructor() {
    super();
    this.addInput("number", 0 as any);
    this.addOutput("", 0 as any);
  }
  onExecute() {
    if (this.getInputData(0) === undefined) return;
    this.setOutputData(0, new anchor.BN(this.getInputData(0)));
  }
}
LiteGraph.registerNodeType(`utils/bigNumber`, BigNumber);

class Get extends UtilNode {
  title = "utils / get";
  constructor() {
    super();
    this.addInput("object", 0 as any);
    this.addInput("path", "string");
    this.addInput("defaultValue?", 0 as any);

    this.addOutput("", 0 as any);
  }
  onExecute() {
    try {
      this.setOutputData(
        0,
        get(this.getInputData(0), this.getInputData(1), this.getInputData(2))
      );
    } catch (err) {
      console.error(err);
    }
  }
}
LiteGraph.registerNodeType(`utils/get`, Get);

class EncodeBase64 extends UtilNode {
  title = "utils / encodeBase64";
  constructor() {
    super();
    this.addInput("arr", 0 as any);

    this.addOutput("", "string");
  }
  onExecute() {
    try {
      this.setOutputData(0, util.encodeBase64(this.getInputData(0)));
    } catch (err) {
      console.error(err);
    }
  }
}
LiteGraph.registerNodeType(`utils/encodeBase64`, EncodeBase64);

class EncodeUTF8 extends UtilNode {
  title = "utils / encodeUTF8";
  constructor() {
    super();
    this.addInput("arr", 0 as any);

    this.addOutput("", "string");
  }
  onExecute() {
    try {
      if (this.getInputData(0)) {
        this.setOutputData(0, util.encodeUTF8(this.getInputData(0)));
      }
    } catch (err) {
      console.error(err);
    }
  }
}
LiteGraph.registerNodeType(`utils/encodeUTF8`, EncodeUTF8);

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
    this.setOutputData(1, this.keypair.publicKey);
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
