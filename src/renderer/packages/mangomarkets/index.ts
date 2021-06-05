import { LGraphNode, LiteGraph } from "litegraph.js";

class MangoNode extends LGraphNode {
  static title_color = "#DD6F3D";
}

class GetMarginAccount extends MangoNode {
  title = "mango / get margin account";

  constructor() {
    super();

    this.addInput("publicKey", 0 as any);
    this.addInput("dexProgramId", 0 as any);

    this.addOutput("marginAccount", 0 as any, { label: "" });
  }
}
LiteGraph.registerNodeType(`mangoMarkets/getMarginAccount`, GetMarginAccount);
