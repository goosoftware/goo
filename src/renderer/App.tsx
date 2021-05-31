import * as anchor from "@project-serum/anchor";
import React from "react";
import assert from "./assert";
import ClusterSelector from "./components/ClusterSelector";
import useAnchor from "./lib/useAnchor";

process.env.PROJECT_ROOT =
  "/Users/john/Code/johnrees/anchor/examples/tutorial/basic-2";

const provider = anchor.Provider.local();
const counter = anchor.web3.Keypair.generate();
const program = anchor.workspace.Basic2;

async function doStuff() {
  await program.rpc.create(provider.wallet.publicKey, {
    accounts: {
      counter: counter.publicKey,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
    },
    signers: [counter],
    instructions: [await program.account.counter.createInstruction(counter)],
  });

  let counterAccount = await program.account.counter(counter.publicKey);

  assert.ok(counterAccount.authority.equals(provider.wallet.publicKey));
  assert.ok(counterAccount.count.toNumber() === 0);

  // increment

  await program.rpc.increment({
    accounts: {
      counter: counter.publicKey,
      authority: provider.wallet.publicKey,
    },
  });

  counterAccount = await program.account.counter(counter.publicKey);

  assert.ok(counterAccount.authority.equals(provider.wallet.publicKey));
  assert.ok(counterAccount.count.toNumber() == 1);
}

doStuff();

export function App() {
  const { user } = useAnchor();

  return (
    <div>
      <header>
        {user?.publicKey.toString()}
        <ClusterSelector />
      </header>
    </div>
  );
}
