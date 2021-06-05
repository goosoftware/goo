import * as anchor from "@project-serum/anchor";
import { createMintAndVault, createTokenAccount } from "@project-serum/common";
import { LGraphNode, LiteGraph } from "litegraph.js";
import get from "lodash/get";
import util from "tweetnacl-util";
import { getAssetCostToStore } from "../packages/metaplex/getAssetCostToStore";

LiteGraph.clearRegisteredTypes();

const provider = anchor.Provider.local();

export class WorkspaceNode extends LGraphNode {
  static title_color = "#0eaf9b";
}

class SolanaNode extends LGraphNode {
  static title_color = "#905ea9";
}

class UtilNode extends LGraphNode {
  static title_color = "#333";
}

class AnchorNode extends LGraphNode {
  static title_color = "#3694E0";
}

class SerumNode extends LGraphNode {
  static title_color = "#007775";
}

class ArweaveNode extends LGraphNode {
  static title_color = "#BBB";
}

class CoinGeckoNode extends LGraphNode {
  static title_color = "#97C255";
}

class MetaplexNode extends LGraphNode {
  static title_color = "#000";
}

class FileNode extends UtilNode {
  title = "utils / file";
  constructor() {
    super();
    this.addOutput("file", 0 as any);
  }
}
LiteGraph.registerNodeType(`utils/file`, FileNode);

class StoragePrice extends ArweaveNode {
  title = "arweave / storage price";
  private bytes: Number;
  private price: Number;

  constructor() {
    super();
    this.addInput("bytes", "number");
    // this.addInput("quoteAsset?", 0 as any);
    this.addOutput("price", 0 as any);

    this.onExecute = this.onExecute.bind(this);
  }

  onExecute() {
    const bytes = this.getInputData(0);
    if (bytes && this.bytes !== bytes) {
      this.bytes = bytes;
      fetch(`https://arweave.net/price/${parseInt(bytes, 10)}`)
        .then((res) => res.text())
        .then((text) => {
          this.price = Number(text) / 10 ** 12;
        });
    }
    this.setOutputData(0, this.price);
  }
}
LiteGraph.registerNodeType(`arweave/storagePrice`, StoragePrice);

class ConvertPrice extends CoinGeckoNode {
  title = "coingecko / convert price";

  private fromPrice: number;
  private toPrice: number;

  private tokens = ["solana", "usd-coin", "arweave", "ethereum"];

  private fromToken;
  private toToken;

  constructor() {
    super();
    this.addInput("fromPrice", 0 as any);
    this.addOutput("toPrice", 0 as any);
    // this.addInput("from", 0 as any);
    // this.addInput("to", 0 as any);

    this.fromToken ??= this.tokens[0];
    this.toToken ??= this.tokens[1];

    this.onExecute = this.onExecute.bind(this);
    this.calculate = this.calculate.bind(this);

    this.addWidget(
      "combo",
      "from",
      this.fromToken,
      (v) => {
        this.fromToken = v;
        this.calculate(true);
      },
      { values: this.tokens }
    );

    this.addWidget(
      "combo",
      "to",
      this.toToken,
      (v) => {
        this.toToken = v;
        this.calculate(true);
      },
      { values: this.tokens }
    );
  }

  private calculate(force = false) {
    const fromPrice = this.getInputData(0);
    if (fromPrice && (this.fromPrice !== fromPrice || force)) {
      this.fromPrice = fromPrice;
      const { fromToken, toToken } = this;
      const url = `https://api.coingecko.com/api/v3/simple/price?ids=${fromToken},${toToken}&vs_currencies=usd`;
      fetch(url)
        .then((res) => res.json())
        .then((json) => {
          const fromToUsd = json[fromToken].usd;
          const toToUsd = json[toToken].usd;

          const usdOfFromPrice = fromPrice * fromToUsd;
          const usdOfToPrice = usdOfFromPrice / toToUsd;

          console.log({
            fromToken,
            toToken,
            fromPrice,
            fromToUsd,
            toToUsd,
            usdOfFromPrice,
            usdOfToPrice,
          });

          this.toPrice = usdOfToPrice;
        });
    }
  }

  onExecute() {
    this.calculate();
    this.setOutputData(0, this.toPrice);

    // const bytes = this.getInputData(0);
    // if (bytes && this.bytes !== bytes) {
    //   this.bytes = bytes;
    //   fetch(`https://arweave.net/price/${parseInt(bytes, 10)}`)
    //     .then((res) => res.text())
    //     .then((text) => {
    //       this.setOutputData(0, Number(text));
    //     });
    // }
  }
}
LiteGraph.registerNodeType(`coinGecko/convertPrice`, ConvertPrice);

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
    if (this.getInputData(0) !== undefined) {
      console.log(this.getInputData(0));
    }
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

class ImageNode extends UtilNode {
  title = "utils / image";
  // desc = "image loader"
  // private supported_extensions = ["jpg", "jpeg", "png", "gif"];
  private img;
  private file;

  private keys = ["name", "size"];

  constructor() {
    super();

    this.addOutput("file", 0 as any);

    this.keys.forEach((key) => {
      this.addOutput(key, 0 as any);
    });

    this.onDrawBackground = this.onDrawBackground.bind(this);
    this.onDropFile = this.onDropFile.bind(this);
    this.onExecute = this.onExecute.bind(this);
  }

  onDrawBackground(ctx) {
    if (this.flags.collapsed) return;
    if (this.size[0] > 5 && this.size[1] > 5 && this.img?.width) {
      ctx.drawImage(this.img, 0, 0, this.size[0], this.size[1]);
    }
  }

  onExecute() {
    if (!this.file) return;

    this.setOutputData(0, this.file);
    this.keys.forEach((key, i) => {
      this.setOutputData(i + 1, this.file[key]);
    });
  }

  private loadImg(url, callback) {
    if (!url) return;
    this.img = document.createElement("img");
    this.img.src = url;
    this.img.onload = () => {
      callback?.();
      this.setDirtyCanvas(true, true);
    };
    this.img.onerror = function () {
      console.log("error loading the image:" + url);
    };
  }

  onDropFile(file: File) {
    this.file = file;
    const url = URL.createObjectURL(file);
    this.properties.url = url;
    this.loadImg(url, () => {
      this.size[1] = (this.img.height / this.img.width) * this.size[0];
    });
  }

  // GraphicsImage.prototype.onPropertyChanged = function(name, value) {
  //     this.properties[name] = value;
  //     if (name == "url" && value != "") {
  //         this.loadImage(value);
  //     }
}
LiteGraph.registerNodeType("utils/image", ImageNode);

class Watch extends UtilNode {
  title = "utils / watch";
  desc = "Show value of input";

  private value;

  constructor() {
    super();
    this.addInput("value", 0 as any, { label: "" });
  }

  onExecute() {
    if (this.inputs[0]) {
      this.value = this.getInputData(0);
    }
  }

  onDrawBackground() {
    this.inputs[0].label = Watch.toString(this.value);
  }

  private static toString(o) {
    try {
      return JSON.stringify(o, null, 2);
    } catch (err) {
      return String(o);
    }
  }
}
LiteGraph.registerNodeType(`utils/watch`, Watch);

class MintNFT extends MetaplexNode {
  title = "metaplex / mint nft";

  constructor() {
    super();

    this.addInput("connection", 0 as any);
    this.addInput("wallet", 0 as any);
    this.addInput("files[]", 0 as any);
    this.addInput("metadata.name", 0 as any);
    this.addInput("metadata.symbol", 0 as any);
    this.addInput("metadata.description", 0 as any);
    this.addInput("metadata.image", 0 as any);
    this.addInput("metadata.external_url", 0 as any);
    this.addInput("metadata.properties", 0 as any);
    this.addInput("metadata.creators[]", 0 as any);
    this.addInput("metadata.sellerFeeBasisPoints", 0 as any);
    this.addInput("maxSupply", 0 as any);

    this.addOutput("tx", 0 as any);
  }

  onExecute() {
    // if (this.inputs[0]) {
    //   this.value = this.getInputData(0);
    // }
  }
}
LiteGraph.registerNodeType(`metaplex/mintNFT`, MintNFT);

class CostToStore extends MetaplexNode {
  title = "metaplex / cost to store";
  private bytes: number;
  private cost: number;

  constructor() {
    super();

    this.addInput("file", 0 as any);
    this.addOutput("lamports", 0 as any);
  }

  onExecute() {
    this.setOutputData(0, this.cost);

    const file = this.getInputData(0);
    if (file?.size && file.size !== this.bytes) {
      this.bytes = file.size;
      console.log("getting cost");

      getAssetCostToStore([file])
        .then((cost) => {
          this.cost = cost;
        })
        .catch(console.error);
    }
  }
}
LiteGraph.registerNodeType(`metaplex/costToStore`, CostToStore);
