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

  constructor() {
    super();

    this.addInput("ciphertext", "string");
    this.addInput("nonce", "string");
    this.addInput("senderPublicKey", "publicKey");
    this.addInput("recipientSecretKey", "secretKey");

    this.addOutput("", "string");
  }

  run() {
    let ciphertext = this.getInputData(0);
    let nonce = this.getInputData(1);
    let pk = this.getInputData(2);
    let sk = this.getInputData(3);

    ciphertext = util.decodeBase64(ciphertext);
    nonce = util.decodeBase64(nonce);
    pk = convertPK(pk).toBytes();
    sk = convertSecretKey(sk);

    const plaintext = nacl.box.open(ciphertext, nonce, pk, sk);

    this.setOutputData(0, util.encodeUTF8(plaintext));
  }
}
