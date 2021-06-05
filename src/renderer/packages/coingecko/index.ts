import { LGraphNode, LiteGraph } from "litegraph.js";

class CoinGeckoNode extends LGraphNode {
  static title_color = "#97C255";
}

class ConvertPrice extends CoinGeckoNode {
  title = "coingecko / convert price";

  private fromPrice: number;
  private toPrice: number;

  private tokens = ["solana", "usd-coin", "arweave", "ethereum"];

  private fromToken;
  private toToken;

  constructor() {
    super();
    this.addInput("fromPrice", 0 as any);
    this.addOutput("toPrice", 0 as any);
    // this.addInput("from", 0 as any);
    // this.addInput("to", 0 as any);

    this.fromToken ??= this.tokens[0];
    this.toToken ??= this.tokens[1];

    this.onExecute = this.onExecute.bind(this);
    this.calculate = this.calculate.bind(this);

    this.addWidget(
      "combo",
      "from",
      this.fromToken,
      (v) => {
        this.fromToken = v;
        this.calculate(true);
      },
      { values: this.tokens }
    );

    this.addWidget(
      "combo",
      "to",
      this.toToken,
      (v) => {
        this.toToken = v;
        this.calculate(true);
      },
      { values: this.tokens }
    );
  }

  private calculate(force = false) {
    const fromPrice = this.getInputData(0);
    if (fromPrice && (this.fromPrice !== fromPrice || force)) {
      this.fromPrice = fromPrice;
      const { fromToken, toToken } = this;
      const url = `https://api.coingecko.com/api/v3/simple/price?ids=${fromToken},${toToken}&vs_currencies=usd`;
      fetch(url)
        .then((res) => res.json())
        .then((json) => {
          const fromToUsd = json[fromToken].usd;
          const toToUsd = json[toToken].usd;

          const usdOfFromPrice = fromPrice * fromToUsd;
          const usdOfToPrice = usdOfFromPrice / toToUsd;

          console.log({
            fromToken,
            toToken,
            fromPrice,
            fromToUsd,
            toToUsd,
            usdOfFromPrice,
            usdOfToPrice,
          });

          this.toPrice = usdOfToPrice;
        });
    }
  }

  onExecute() {
    this.calculate();
    this.setOutputData(0, this.toPrice);

    // const bytes = this.getInputData(0);
    // if (bytes && this.bytes !== bytes) {
    //   this.bytes = bytes;
    //   fetch(`https://arweave.net/price/${parseInt(bytes, 10)}`)
    //     .then((res) => res.text())
    //     .then((text) => {
    //       this.setOutputData(0, Number(text));
    //     });
    // }
  }
}
LiteGraph.registerNodeType(`coinGecko/convertPrice`, ConvertPrice);
