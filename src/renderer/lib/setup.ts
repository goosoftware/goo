import * as anchor from "@project-serum/anchor";
import { LGraphNode, LiteGraph } from "litegraph.js";

LiteGraph.clearRegisteredTypes();

process.env.PROJECT_ROOT =
  "/Users/john/Code/johnrees/anchor/examples/tutorial/basic-2";

const provider = anchor.Provider.local();
const workspace = "Basic2";
const program = anchor.workspace[workspace];
const idl = program._idl as anchor.Idl;

console.log({ program, idl });

console.log(program.account.counter.createInstruction);

type RPC = [string, (...args: any) => Promise<any>];

class SolanaNode extends LGraphNode {
  static title_color = "#905ea9";
}

class WorkspaceNode extends LGraphNode {
  static title_color = "#0eaf9b";
}

class UtilNode extends LGraphNode {
  static title_color = "#000";
}

class ProviderWallet extends SolanaNode {
  title = "solana / provider wallet";
  constructor() {
    super();
    this.addOutput("wallet", 0 as any);
    this.addOutput("publicKey", 0 as any);
  }
  onExecute() {
    this.setOutputData(0, provider.wallet);
    this.setOutputData(0, provider.wallet.publicKey);
  }
}
LiteGraph.registerNodeType(`solana/providerWallet`, ProviderWallet);

class Logger extends UtilNode {
  title = "utils / logger";
  constructor() {
    super();
    this.addInput("data", 0 as any);
  }
  onExecute() {
    console.log(this.getInputData(0));
  }
}
LiteGraph.registerNodeType(`utils/logger`, Logger);

class GenerateKeypair extends SolanaNode {
  title = "solana / generate keypair";
  private keypair = anchor.web3.Keypair.generate();
  constructor() {
    super();
    this.addOutput("keypair", 0 as any);
    this.addOutput("publicKey", 0 as any);
    this.addOutput("secretKey", 0 as any);
  }
  onExecute() {
    this.setOutputData(0, this.keypair);
    this.setOutputData(1, this.keypair.publicKey);
    this.setOutputData(2, this.keypair.secretKey);
  }
}
LiteGraph.registerNodeType(`anchor/generateKeypair`, GenerateKeypair);

class SYSVARS extends SolanaNode {
  title = "solana / SYSVARS";
  constructor() {
    super();
    this.addOutput("CLOCK", "publicKey");
    this.addOutput("INSTRUCTIONS", "publicKey");
    this.addOutput("RECENT_BLOCKHASHES", "publicKey");
    this.addOutput("RENT", "publicKey");
    this.addOutput("REWARDS", "publicKey");
    this.addOutput("STAKE_HISTORY", "publicKey");
  }
  onExecute() {
    this.setOutputData(0, anchor.web3.SYSVAR_CLOCK_PUBKEY);
    this.setOutputData(1, anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY);
    this.setOutputData(2, anchor.web3.SYSVAR_RECENT_BLOCKHASHES_PUBKEY);
    this.setOutputData(3, anchor.web3.SYSVAR_RENT_PUBKEY);
    this.setOutputData(4, anchor.web3.SYSVAR_REWARDS_PUBKEY);
    this.setOutputData(5, anchor.web3.SYSVAR_STAKE_HISTORY_PUBKEY);
  }
}
LiteGraph.registerNodeType(`solana/SYSVARS`, SYSVARS);

// Object.entries(program.rpc).forEach(([key, fn]: RPC) => {
//   class RPCNode extends WorkspaceNode {
//     title = [workspace, "rpc", key].join(".");
//     constructor() {
//       super();
//       this.addInput("args", 0 as any);
//     }
//     onExecute() {
//       try {
//         fn(...this.getInputData(0))
//           .then(console.log)
//           .catch(console.error);
//       } catch (err) {}
//     }
//   }
//   LiteGraph.registerNodeType(`anchor/${workspace}/rpc/${key}`, RPCNode);
// });

idl.accounts.forEach((account) => {
  class Account extends WorkspaceNode {
    title = `${workspace}.${account.name}`;
    constructor() {
      super();
      this.addInput("publicKey", 0 as any);

      account.type.fields.forEach((field) => {
        this.addOutput(field.name, 0 as any);
      });
    }
    onExecute() {}
  }
  LiteGraph.registerNodeType(account.name, Account);

  class CreateInstruction extends WorkspaceNode {
    title = `${workspace}.${account.name}.createInstruction`;
    constructor() {
      super();
      this.addInput("signer", 0 as any);
      this.addInput("sizeOverride", 0 as any);

      this.addOutput("instruction", 0 as any);
    }
    onExecute() {}
  }
  LiteGraph.registerNodeType(
    [account.name, "createInstruction"].join("/"),
    CreateInstruction
  );
});

idl.instructions.forEach((instruction) => {
  class InstructionNode extends WorkspaceNode {
    title = [workspace, instruction.name].join(".");

    constructor() {
      super();
      instruction.args.forEach((arg) => {
        this.addInput(arg.name, 0 as any);
      });
      instruction.accounts.forEach((acc) => {
        this.addInput(acc.name, 0 as any, { shape: LiteGraph.ARROW_SHAPE });
      });
      this.addInput("signers", 0 as any);
      this.addInput("instructions", 0 as any);
    }

    onExecute() {
      console.log(
        this.inputs.map((input, i) => {
          return i;
        })
      );
    }
  }
  LiteGraph.registerNodeType(
    `anchor/${workspace}/${instruction.name}`,
    InstructionNode
  );
});

// const counter = anchor.web3.Keypair.generate();
// async function doStuff() {
//   await program.rpc.create(provider.wallet.publicKey, {
//     accounts: {
//       counter: counter.publicKey,
//       rent: anchor.web3.SYSVAR_RENT_PUBKEY,
//     },
//     signers: [counter],
//     instructions: [await program.account.counter.createInstruction(counter)],
//   });

//   let counterAccount = await program.account.counter(counter.publicKey);

//   assert.ok(counterAccount.authority.equals(provider.wallet.publicKey));
//   assert.ok(counterAccount.count.toNumber() === 0);

//   // increment

//   await program.rpc.increment({
//     accounts: {
//       counter: counter.publicKey,
//       authority: provider.wallet.publicKey,
//     },
//   });

//   counterAccount = await program.account.counter(counter.publicKey);

//   assert.ok(counterAccount.authority.equals(provider.wallet.publicKey));
//   assert.ok(counterAccount.count.toNumber() == 1);
// }
// doStuff();
