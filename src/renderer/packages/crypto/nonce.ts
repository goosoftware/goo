import { randomBytes, secretbox } from "tweetnacl";
import util from "tweetnacl-util";
import { CryptoNode } from "./utils";

export default class Nonce extends CryptoNode {
  title = "cryptography / nonce";
  static size = [220, 30];

  private nonce = randomBytes(secretbox.nonceLength);

  constructor() {
    super();
    this.addOutput("", "string");
  }

  onExecute() {
    this.setOutputData(0, util.encodeBase64(this.nonce));
  }
}
