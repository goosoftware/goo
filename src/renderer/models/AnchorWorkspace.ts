import * as anchor from "@project-serum/anchor";
import { LiteGraph } from "litegraph.js";
import { getParent, types } from "mobx-state-tree";
import { WorkspaceNode } from "../lib/defaultNodes";

const instructionOrMethodNodeFactory =
  (workspaceName: string, addNode) => (instruction) => {
    class InstructionNode extends WorkspaceNode {
      title = [workspaceName, instruction.name].join(".");

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
      `${workspaceName}/${instruction.name}`,
      InstructionNode
    );
    addNode(`${workspaceName}/${instruction.name}`);
  };

const AnchorWorkspace = types
  .model({
    id: types.identifier,
    name: types.string,
    nodes: types.optional(types.array(types.string), []),
  })
  .actions((self) => {
    const workspace = anchor.workspace[self.name];

    return {
      remove() {
        (getParent(self, 2) as any).removeWorkspace(self);
      },

      afterAttach() {
        const idl = workspace._idl as anchor.Idl;
        console.log({ idl });

        idl.accounts?.forEach((account) => {
          class Account extends WorkspaceNode {
            title = `${self.name}.${account.name}`;
            constructor() {
              super();
              this.addInput("publicKey", 0 as any);

              account.type.fields.forEach((field) => {
                this.addOutput(field.name, 0 as any);
              });
            }
            onExecute() {}
          }
          LiteGraph.registerNodeType(`${self.name}/${account.name}`, Account);
          self.nodes.push(`${self.name}/${account.name}`);

          class CreateInstruction extends WorkspaceNode {
            title = `${self.name}.${account.name}.createInstruction`;
            constructor() {
              super();
              this.addInput("signer", 0 as any);
              this.addInput("sizeOverride", 0 as any);

              this.addOutput("instruction", 0 as any);
            }
            onExecute() {}
          }
          LiteGraph.registerNodeType(
            `${self.name}/${account.name}/createInstruction`,
            CreateInstruction
          );
          self.nodes.push(`${self.name}/${account.name}/createInstruction`);
        });

        const makeNode = instructionOrMethodNodeFactory(self.name, (x) =>
          self.nodes.push(x)
        );
        idl.instructions.forEach(makeNode);
        idl.state?.methods.forEach(makeNode);
      },

      beforeDestroy() {
        self.nodes.forEach((node) => {
          console.log("removing ", node);
          LiteGraph.unregisterNodeType(node);
        });
      },
    };
  });

export default AnchorWorkspace;
