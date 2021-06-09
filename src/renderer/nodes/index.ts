// TODO: esbuild doesn't like doing this instead
//
// LiteGraph.clearRegisteredTypes();
//
// readdirSync(resolve("./src/renderer/nodes"), {
//   withFileTypes: true,
// })
//   .filter((d) => d.isDirectory())
//   .map((d) => d.name)
//   .filter((n) => !n.startsWith("."))
//   .map((x) => {
//     console.log(resolve(`./src/renderer/nodes/${x}`));
//     return x;
//   })
//   .forEach((n) => require(resolve(n)));

import "./anchor";
import "./arweave";
import "./charts";
import "./coingecko";
import "./crypto";
import "./mangomarkets";
import "./metaplex";
import "./psyoptions";
import "./serum";
import "./solana";
import "./switchboard";
import "./utils";
