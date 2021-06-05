import { PublicKey } from "@solana/web3.js";
import { convertPublicKey, convertSecretKey } from "ed2curve";
import nacl from "tweetnacl";
import util from "tweetnacl-util";
import { CryptoNode } from "./utils";

const convertPK = (inKey: string | Uint8Array) => {
  const compatibleKey = new PublicKey(inKey).toBytes();
  const outKey = convertPublicKey(compatibleKey);
  return new PublicKey(outKey!);
};
export default class Decrypt extends CryptoNode {
  title = "cryptography / decrypt";
  static size = [250, 100];
  static title_color = "#577277";

  constructor() {
    super();
    this.addInput("ciphertext", "string");
    this.addInput("nonce", "string");
    this.addInput("senderPublicKey", "publicKey");
    this.addInput("recipientSecretKey", "secretKey");
    this.addOutput("", "string");
  }

  onExecute() {
    try {
      const ciphertext = util.decodeBase64(this.getInputData(0));
      const nonce = util.decodeBase64(this.getInputData(1));
      const pk = convertPK(this.getInputData(2)).toBytes();
      const sk = convertSecretKey(this.getInputData(3));

      const plaintext = nacl.box.open(ciphertext, nonce, pk, sk);

      console.log({ plaintext });

      this.setOutputData(0, util.encodeUTF8(plaintext!));
      this.bgcolor = "";
    } catch (err) {
      this.setOutputData(0, null);
      this.bgcolor = "red";
      console.error(err);
    }
  }
}
