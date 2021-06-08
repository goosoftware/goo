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

  private nonce; // = randomBytes(secretbox.nonceLength);
  private plainText;
  private pk;
  private sk;
  private cipherText;

  constructor() {
    super();

    this.addInput("plaintext", "string");
    this.addInput("receipientPublicKey", "publicKey");
    this.addInput("senderSecretKey", "secretKey");
    this.addInput("nonce?", "string");

    this.addOutput("ciphertext", "string");
    this.addOutput("nonce", "string");
  }

  run() {
    let dirty = false;
    if (this.getInputData(0) && this.plainText !== this.getInputData(0)) {
      this.plainText = this.getInputData(0);
      dirty = true;
    }
    if (this.getInputData(1) && this.pk !== this.getInputData(1)) {
      this.pk = this.getInputData(1);
      dirty = true;
    }
    if (this.getInputData(2) && this.sk !== this.getInputData(2)) {
      this.sk = this.getInputData(2);
      dirty = true;
    }
    if (dirty && this.plainText && this.pk && this.sk) {
      this.encrypt();
    }

    this.setOutputData(0, this.cipherText);
    this.setOutputData(1, this.nonce);
  }

  private encrypt() {
    try {
      const nonce = this.getInputData(3)
        ? util.decodeBase64(this.getInputData(3))
        : randomBytes(secretbox.nonceLength);
      // const nonce = this.nonce;

      const plaintext = util.decodeUTF8(this.plainText);
      const pk = convertPK(this.pk).toBytes();
      const sk = convertSecretKey(this.sk);

      const ciphertext = nacl.box(plaintext, nonce, pk, sk);

      this.cipherText = util.encodeBase64(ciphertext!);
      this.nonce = util.encodeBase64(nonce);

      this.bgcolor = "";
    } catch (err) {
      this.cipherText = null;

      this.bgcolor = "red";
      console.error(err);
    }
  }
}
