import { LiteGraph } from "litegraph.js";
import ConvertPublicKey from "./convertPublicKey";
import Decrypt from "./decrypt";
import Encrypt from "./encrypt";
import Nonce from "./nonce";

LiteGraph.registerNodeType("cryptography/convertPublicKey", ConvertPublicKey);
LiteGraph.registerNodeType("cryptography/decrypt", Decrypt);
LiteGraph.registerNodeType("cryptography/encrypt", Encrypt);
LiteGraph.registerNodeType("cryptography/nonce", Nonce);
