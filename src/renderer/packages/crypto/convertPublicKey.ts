import { PublicKey } from "@solana/web3.js";
import { convertPublicKey } from "ed2curve";
import { CryptoNode } from "./utils";

export const convertKey = (inKey: string | Uint8Array) => {
  const compatibleKey = new PublicKey(inKey).toBytes();
  const outKey = convertPublicKey(compatibleKey);
  return new PublicKey(outKey!).toString();
};

export default class ConvertPublicKey extends CryptoNode {
  title = "crypto / convert key";

  constructor() {
    super();
    this.addInput("publicKey", 0 as any);
    this.addOutput("convertedKey", 0 as any, { label: "" });
  }

  onConnectOutput() {
    const inKey = this.getInputData(0);
    const outKey = convertKey(inKey);
    console.info({ inKey, outKey });

    setTimeout(() => {
      this.setOutputData(0, outKey);
    }, 1);

    return true;
  }
}
