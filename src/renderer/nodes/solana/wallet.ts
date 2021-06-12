import { LiteGraph } from "litegraph.js";
import natsort from "natsort";
import { rpc, SolanaNode } from "./_base";

// https://spl.solana.com/token#finding-all-token-accounts-for-a-wallet
class Wallet extends SolanaNode {
  title = "solana / wallet";

  private tokens: Array<any> = [];
  private solBalance?: any;

  constructor() {
    super();
    this.addInput("address", "publicKey", {
      shape: LiteGraph.ARROW_SHAPE,
    });
    this.addInput("trigger", LiteGraph.EVENT);
    this.addOutput("data", "string", { label: "" });
  }

  // static size = [250, 50];

  onAction() {
    const address = this.getInputData(0)?.toString();

    if (!address) throw "no address";

    rpc({
      method: "getBalance",
      params: [address],
    }).then(({ data }: any) => {
      this.solBalance = data.result.value / 10 ** 9;
    });

    rpc({
      method: "getProgramAccounts",
      params: [
        "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        {
          encoding: "jsonParsed",
          filters: [
            {
              dataSize: 165,
            },
            {
              memcmp: {
                offset: 32,
                bytes: address,
              },
            },
          ],
        },
      ],
    }).then(({ data }: any) => {
      const tokens = data.result
        .filter(
          (r: any) => r.account.data.parsed.info.tokenAmount.uiAmount !== 0
        )
        .sort((a: any, b: any) =>
          natsort({ desc: true })(
            a.account.data.parsed.info.tokenAmount.uiAmount,
            b.account.data.parsed.info.tokenAmount.uiAmount
          )
        );

      this.tokens = tokens;
      this.size = [200, (this.tokens.length + 4) * 20];

      console.log(this.tokens);
    });
  }

  onDrawBackground(ctx: CanvasRenderingContext2D) {
    if (this.flags.collapsed) return;

    this.draw(ctx);
  }

  private draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "white";
    ctx.font = "14px Menlo";

    if (this.solBalance) {
      ctx.fillText(`$SOL - ${this.solBalance}`, 10, 60);
    }

    for (let i = 0; i < this.tokens.length; i++) {
      const { pubkey, account } = this.tokens[i];

      const str = [
        pubkey,
        // account.data.parsed.info.mint,
        // account.data.parsed.info.owner,
        account.data.parsed.info.tokenAmount.uiAmount,
      ].join(" - ");

      ctx.fillText(str, 10, i * 20 + 80);
    }
  }
}

LiteGraph.registerNodeType("solana/wallet", Wallet);
