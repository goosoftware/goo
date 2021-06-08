import { GooNode } from "@goosoftware/goo";
import { LiteGraph } from "litegraph.js";

class SwitchboardNode extends GooNode {
  static title_color = "#030231";
}

class GetFeed extends SwitchboardNode {
  title = "switchboard / get feed";

  constructor() {
    super();

    this.addInput("dataFeedPubkey", 0 as any);
    this.addInput("keypair", 0 as any);
    this.addInput("programPubkey", 0 as any);

    this.addOutput("feed", 0 as any, { label: "" });
  }
}
LiteGraph.registerNodeType(`switchboard/getFeed`, GetFeed);

class CreateDataFeed extends SwitchboardNode {
  title = "switchboard / create datafeed";

  constructor() {
    super();

    this.addInput("dataFeedPubkey", 0 as any);
    this.addInput("keypair", 0 as any);
    this.addInput("programPubkey", 0 as any);

    this.addOutput("feed", 0 as any, { label: "" });
  }
}
LiteGraph.registerNodeType(`switchboard/addFeedJob`, CreateDataFeed);

class AddFeedJob extends SwitchboardNode {
  title = "switchboard / add feed job";

  constructor() {
    super();

    this.addInput("dataFeedPubkey", 0 as any);
    this.addInput("keypair", 0 as any);
    this.addInput("programPubkey", 0 as any);

    this.addOutput("feed", 0 as any, { label: "" });
  }
}
LiteGraph.registerNodeType(`switchboard/addFeedJob`, AddFeedJob);

class CreateFulfillmentManager extends SwitchboardNode {
  title = "switchboard / create datafeed";

  constructor() {
    super();

    this.addInput("dataFeedPubkey", 0 as any);
    this.addInput("keypair", 0 as any);
    this.addInput("programPubkey", 0 as any);

    this.addOutput("feed", 0 as any, { label: "" });
  }
}
LiteGraph.registerNodeType(
  `switchboard/createFulfillmentManager`,
  CreateFulfillmentManager
);
