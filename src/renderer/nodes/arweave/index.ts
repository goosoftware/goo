import { GooNode } from "@goosoftware/goo";
import { LiteGraph } from "litegraph.js";
class ArweaveNode extends GooNode {
  static title_color = "#BBB";
}

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
