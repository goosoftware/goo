import { Market } from "@mithraic-labs/psyoptions";
import { Market as SerumMarket } from "@mithraic-labs/serum";
import { Connection, PublicKey } from "@solana/web3.js";
import { LGraphNode, LiteGraph } from "litegraph.js";

const OPTION_PROGRAM_ID = new PublicKey(
  "GDvqQy3FkDB2wyNwgZGp5YkmRMUmWbhNNWDMYKbLSZ5N"
);

const DEX_PROGRAM_ID = new PublicKey(
  "DESVgJVGajEgKGXhb6XmqDHGz3VjdgP7rEVESBgxmroY"
);

(async () => {
  const connection = new Connection("https://devnet.solana.com");

  const devnetBTCKey = new PublicKey(
    "C6kYXcaRUMqeBF5fhg165RWU7AnpT9z92fvKNoMqjmz6"
  );
  const devnetUSDCKey = new PublicKey(
    "E6Z6zLzk8MWY3TY8E87mr88FhGowEPJTeMWzkqtL6qkF"
  );

  let res = await Market.getAllMarketsBySplSupport(
    connection,
    OPTION_PROGRAM_ID,
    [devnetBTCKey, devnetUSDCKey]
  );

  const marketMetaData = [];
  await Promise.all(
    res.map(async (market) => {
      try {
        const underlyingAssetMint =
          market.marketData.underlyingAssetMintKey.toString();
        const quoteAssetMint = market.marketData.quoteAssetMintKey.toString();
        let quoteAssetSymbol, underlyingAssetSymbol;
        if (quoteAssetMint === devnetBTCKey.toString()) {
          quoteAssetSymbol = "BTC";
        } else if (quoteAssetMint === devnetUSDCKey.toString()) {
          quoteAssetSymbol = "USDC";
        }
        if (underlyingAssetMint === devnetBTCKey.toString()) {
          underlyingAssetSymbol = "BTC";
        } else if (underlyingAssetMint === devnetUSDCKey.toString()) {
          underlyingAssetSymbol = "USDC";
        }

        const serumMarketMeta = await SerumMarket.findAccountsByMints(
          connection,
          market.marketData.optionMintKey,
          devnetUSDCKey,
          DEX_PROGRAM_ID
        );

        if (!serumMarketMeta[0]) return;

        marketMetaData.push({
          expiration: market.marketData.expirationUnixTimestamp,
          optionMarketAddress: market.pubkey.toString(),
          optionContractMintAddress: market.marketData.optionMintKey.toString(),
          optionWriterTokenMintAddress:
            market.marketData.writerTokenMintKey.toString(),
          quoteAssetMint,
          quoteAssetSymbol,
          underlyingAssetMint,
          underlyingAssetSymbol,
          underlyingAssetPerContract:
            market.marketData.amountPerContract.toString(),
          quoteAssetPerContract:
            market.marketData.quoteAmountPerContract.toString(),
          serumMarketAddress: serumMarketMeta[0].publicKey.toString(),
        });
      } catch (error) {
        console.log(`ERROR: for market ${market.pubkey.toString()}\n`, error);
      }
    })
  );

  console.log(marketMetaData);
})();

class PsyoptionsNode extends LGraphNode {
  static title_color = "#D5396D";
}

class GetMarkets extends PsyoptionsNode {
  title = "psyoptions / get markets";

  constructor() {
    super();
    this.addInput("quoteMarket", 0 as any);
    this.addInput("underlyingMarket", 0 as any);

    this.addOutput("markets", 0 as any, { label: "" });
  }

  onExecute() {}
}

LiteGraph.registerNodeType("psyoptions/getMarkets", GetMarkets);
