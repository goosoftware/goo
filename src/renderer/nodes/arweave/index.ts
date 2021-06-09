import { GooNode } from "@goosoftware/goo";
import { LiteGraph } from "litegraph.js";

class ArweaveNode extends GooNode {
  static title_color = "#BBB";
}

class StoragePrice extends ArweaveNode {
  title = "arweave / storage price";

  constructor() {
    super();
    this.addInput("bytes", "number");
    this.addOutput("price", 0 as any);

    this.onExecute = this.onExecute.bind(this);
  }

  async run() {
    const bytes = this.getInputData(0);

    const int = parseInt(bytes, 10);

    if (!int) throw "no bytes";

    const res = await fetch(`https://arweave.net/price/${int}`);
    const text = await res.text();

    this.setOutputData(0, Number(text) / 10 ** 12);
  }
}
LiteGraph.registerNodeType(`arweave/storagePrice`, StoragePrice);
