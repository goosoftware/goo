import { PublicKey } from "@solana/web3.js";
import { convertPublicKey, convertSecretKey } from "ed2curve";
import nacl, { randomBytes, secretbox } from "tweetnacl";
import util from "tweetnacl-util";
import { CryptoNode } from "./utils";

const convertPK = (inKey: string | Uint8Array) => {
  const compatibleKey = new PublicKey(inKey).toBytes();
  const outKey = convertPublicKey(compatibleKey);
  return new PublicKey(outKey!);
};

export default class Encrypt extends CryptoNode {
  title = "cryptography / encrypt";

  constructor() {
    super();
    this.addInput("plaintext", "string");
    this.addInput("receipientPublicKey", "publicKey");
    this.addInput("senderSecretKey", "secretKey");
    this.addInput("nonce?", "string");
    this.addOutput("ciphertext", "string");
    this.addOutput("nonce", "string");
  }

  onExecute() {
    try {
      const nonce = this.getInputData(3)
        ? util.decodeBase64(this.getInputData(3))
        : randomBytes(secretbox.nonceLength);

      const plaintext = util.decodeUTF8(this.getInputData(0));
      const pk = convertPK(this.getInputData(1)).toBytes();
      const sk = convertSecretKey(this.getInputData(2));

      const ciphertext = nacl.box(plaintext, nonce, pk, sk);

      this.setOutputData(0, util.encodeBase64(ciphertext!));
      this.setOutputData(1, util.encodeBase64(nonce));

      this.bgcolor = "";
    } catch (err) {
      this.setOutputData(0, null);
      this.bgcolor = "red";
      console.error(err);
    }
  }
}
