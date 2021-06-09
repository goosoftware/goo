import isEqual from "fast-deep-equal";
import { LGraphNode } from "litegraph.js";

const Colors = {
  IDLE: "",
  ACTIVE: "#F59E0B",
  SUCCESS: "#059669",
  ERROR: "#DC2626",
};

export class GooNode extends LGraphNode {
  version = "0.0.1";
  private previousInputs;

  constructor() {
    super();

    this.onFailure = this.onFailure.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
  }

  run(): Promise<void> | void {}

  onConnectionsChange() {
    // TODO: be smarter than this
    this.onExecute(true);
  }

  onExecute(force = false) {
    if (!force) {
      const currentInputs = this.inputs.map((_, i) => this.getInputData(i));

      // TODO: replace this with something like callbags
      if (!this.run || isEqual(this.previousInputs, currentInputs)) {
        return;
      }
      this.previousInputs = currentInputs;
    }

    this.bgcolor = Colors.ACTIVE;

    try {
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

    this.outputs.forEach((_, i) => {
      this.setOutputData(i, undefined);
    });
  }

  onSuccess() {
    this.bgcolor = Colors.SUCCESS;
    setTimeout(() => {
      this.bgcolor = Colors.IDLE;
    }, 1000);
  }
}
