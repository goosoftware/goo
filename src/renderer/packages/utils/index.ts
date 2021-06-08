import { GooNode } from "@goosoftware/goo";
import * as anchor from "@project-serum/anchor";
import { JSONPath } from "jsonpath-plus";
import { LiteGraph } from "litegraph.js";
import get from "lodash/get";
import util from "tweetnacl-util";

class UtilNode extends GooNode {
  static title_color = "#333";
}
class FileNode extends UtilNode {
  title = "utils / file";
  constructor() {
    super();
    this.addOutput("file", 0 as any);
  }
}
LiteGraph.registerNodeType(`utils/file`, FileNode);

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

class Foo extends UtilNode {
  title = "utils / json";

  constructor() {
    super();
    this.addOutput("json", 0 as any);
  }

  onExecute() {
    this.setOutputData(0, {
      foo: "bar",
    });
    // if (this.inputs[0]) {
    //   this.value = this.getInputData(0);
    // }
  }
}
LiteGraph.registerNodeType(`utils/json`, Foo);

class JSONPathNode extends UtilNode {
  title = "utils / json path";

  private path;

  constructor() {
    super();
    this.addInput("json", 0 as any);
    this.addWidget("text", "jsonpath", "$", (newPath) => {
      this.path = newPath;
    });
    this.addOutput("json", 0 as any, { label: "" });
  }

  onExecute() {
    try {
      this.setOutputData(
        0,
        JSONPath({
          path: this.path ?? "",
          json: this.getInputData(0),
        })
      );
    } catch (err) {}
  }
}
LiteGraph.registerNodeType(`utils/jsonPath`, JSONPathNode);
