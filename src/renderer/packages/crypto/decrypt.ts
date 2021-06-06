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

  private nonce;
  private plainText;
  private pk;
  private sk;
  private cipherText;

  constructor() {
    super();

    this.addInput("ciphertext", "string");
    this.addInput("nonce", "string");
    this.addInput("senderPublicKey", "publicKey");
    this.addInput("recipientSecretKey", "secretKey");

    this.addOutput("", "string");
  }

  onExecute() {
    let dirty = false;
    if (this.getInputData(0) && this.cipherText !== this.getInputData(0)) {
      this.cipherText = this.getInputData(0);
      dirty = true;
    }
    if (this.getInputData(1) && this.nonce !== this.getInputData(1)) {
      this.nonce = this.getInputData(1);
      dirty = true;
    }
    if (this.getInputData(2) && this.pk !== this.getInputData(2)) {
      this.pk = this.getInputData(2);
      dirty = true;
    }
    if (this.getInputData(3) && this.sk !== this.getInputData(3)) {
      this.sk = this.getInputData(3);
      dirty = true;
    }
    if (dirty && this.cipherText && this.nonce && this.pk && this.sk) {
      this.decrypt();
    }

    this.setOutputData(0, this.plainText);
  }

  private decrypt() {
    try {
      const ciphertext = util.decodeBase64(this.cipherText);
      const nonce = util.decodeBase64(this.nonce);
      const pk = convertPK(this.pk).toBytes();
      const sk = convertSecretKey(this.sk);

      const plaintext = nacl.box.open(ciphertext, nonce, pk, sk);

      console.log({ plaintext });

      this.plainText = util.encodeUTF8(plaintext!);

      this.bgcolor = "";
    } catch (err) {
      this.plainText = null;
      this.bgcolor = "red";
      console.error(err);
    }
  }
}
