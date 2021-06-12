import { GooNode } from "@goosoftware/goo";
import axios from "axios";
import { store } from "models/Store";

export const rpc = (data: any) =>
  axios.post(store.clusterUrl(store.cluster), {
    jsonrpc: "2.0",
    id: 1,
    ...data,
  });

export class SolanaNode extends GooNode {
  static title_color = "#905ea9";

  protected send(data: any) {
    rpc(data).then((res) => this.setOutputData(0, res));
  }
}
