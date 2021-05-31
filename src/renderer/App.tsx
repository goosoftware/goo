import * as anchor from "@project-serum/anchor";
import { LGraphNode, LiteGraph } from "litegraph.js";
import React from "react";
import ClusterSelector from "./components/ClusterSelector";
import Editor from "./Editor";
import useAnchor from "./lib/useAnchor";

process.env.PROJECT_ROOT =
  "/Users/john/Code/johnrees/anchor/examples/tutorial/basic-2";

const workspace = "Basic2";
const program = anchor.workspace[workspace];
const idl = program._idl as anchor.Idl;

idl.instructions.forEach((instruction) => {
  class WorkspaceNode extends LGraphNode {
    title = [workspace, instruction.name].join(".");
    constructor() {
      super();
      instruction.args.forEach((arg) => {
        this.addInput(arg.name, 0 as any);
      });
      instruction.accounts.forEach((acc) => {
        this.addInput(acc.name, 0 as any, { shape: LiteGraph.ARROW_SHAPE });
      });
    }
  }
  LiteGraph.registerNodeType(
    `anchor/${workspace}/${instruction.name}`,
    WorkspaceNode
  );
});

export function App() {
  const { user } = useAnchor();

  return (
    <div>
      <header>
        {user?.publicKey.toString()}
        <ClusterSelector />
      </header>
      <div>
        <Editor />
      </div>
    </div>
  );
}
