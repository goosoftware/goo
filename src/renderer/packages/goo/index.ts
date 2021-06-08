import isEqual from "fast-deep-equal";
import { LGraphNode } from "litegraph.js";

const Colors = {
  IDLE: "",
  ACTIVE: "yellow",
  SUCCESS: "green",
  ERROR: "red",
};

export default class GooNode extends LGraphNode {
  version = "0.0.1";
  private previousInputs;

  constructor() {
    super();

    this.onFailure = this.onFailure.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
  }

  run(): Promise<void> | void {}

  onExecute() {
    const currentInputs = this.inputs.map((_, i) => this.getInputData(i));

    // TODO: replace this with something like callbags
    if (!this.run || isEqual(this.previousInputs, currentInputs)) {
      return;
    }
    this.previousInputs = currentInputs;

    this.bgcolor = Colors.IDLE;

    try {
      console.log(this.title);
      // https://davidwalsh.name/javascript-detect-async-function
      if (this.run.constructor.name === "AsyncFunction") {
        // @ts-expect-error
        this.run().then(this.onSuccess).catch(this.onFailure);
      } else {
        this.run();
        this.onSuccess();
      }
    } catch (err) {
      this.onFailure(err);
    }
  }

  onFailure(err: Error) {
    console.error(err);
    this.bgcolor = Colors.ERROR;
  }

  onSuccess() {
    this.bgcolor = Colors.SUCCESS;
  }
}
