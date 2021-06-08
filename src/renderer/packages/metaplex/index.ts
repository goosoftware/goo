import { GooNode } from "@goosoftware/goo";
import { LiteGraph } from "litegraph.js";
import { getAssetCostToStore } from "./getAssetCostToStore";

class MetaplexNode extends GooNode {
  static title_color = "#000";
}

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
