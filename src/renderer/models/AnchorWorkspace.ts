import * as anchor from "@project-serum/anchor";
import { IdlInstruction } from "@project-serum/anchor/dist/idl";
import { LiteGraph } from "litegraph.js";
import { getParent, types } from "mobx-state-tree";
import { WorkspaceNode } from "../lib/defaultNodes";

const instructionOrMethodNodeFactory =
  (workspace, name, addNode) => (instruction: IdlInstruction) => {
    class InstructionNode extends WorkspaceNode {
      title = [name, instruction.name].join(".");

      constructor() {
        super();
        this.bgcolor = "";

        instruction.args.forEach((arg) => {
          this.addInput(arg.name, 0 as any);
        });
        instruction.accounts.forEach((acc) => {
          this.addInput(acc.name, 0 as any, { shape: LiteGraph.ARROW_SHAPE });
        });
        this.addInput("signers", 0 as any);
        this.addInput("instructions", 0 as any);
        this.addInput("trigger", LiteGraph.ACTION);

        this.addOutput("tx", 0 as any);

        // account.type.fields.forEach((field) => {
        //   this.addOutput(field.name, 0 as any);
        // });

        this.handleError = this.handleError.bind(this);
        this.handleSuccess = this.handleSuccess.bind(this);
      }

      onAction() {
        try {
          const ob = [
            ...Array(instruction.args.length).fill("args"),
            ...Array(instruction.accounts.length).fill("accounts"),
            "signers",
            "instructions",
          ].reduce((acc, curr, i) => {
            const val = this.getInputData(i);
            if (val === undefined) return acc;

            if (curr === "accounts") {
              acc[curr] ||= {};
              acc[curr][this.inputs[i].name] = val;
            } else {
              acc[curr] ||= [];
              acc[curr].push(val);
            }
            return acc;
          }, {});

          // console.log(`
          //   workspace.rpc[${instruction.name}](${ob.args}, {
          //     accounts: ${JSON.stringify(ob.accounts)},
          //     signers: ${JSON.stringify(ob.signers)},
          //     instructions: ${JSON.stringify(ob.instructions)},
          //   }).then(console.log);
          // `);

          if (ob.args?.length > 0) {
            workspace.rpc[instruction.name](...ob.args, {
              accounts: ob.accounts,
              signers: ob.signers,
              instructions: ob.instructions,
            })
              .then(this.handleSuccess)
              .catch(this.handleError);
          } else {
            workspace.rpc[instruction.name]({
              accounts: ob.accounts,
              signers: ob.signers,
              instructions: ob.instructions,
            })
              .then(this.handleSuccess)
              .catch(this.handleError);
          }
        } catch (err) {
          this.handleError(err);
        }
      }

      private handleError(err) {
        console.error(this.title, {
          err,
        });
        this.bgcolor = "red";
      }

      private handleSuccess(data) {
        console.log(data);
        this.bgcolor = "green";
      }
    }

    LiteGraph.registerNodeType(`${name}/${instruction.name}`, InstructionNode);
    addNode(`${name}/${instruction.name}`);
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
        const isNew = self.nodes.length === 0;

        idl.accounts?.forEach((account) => {
          class Account extends WorkspaceNode {
            title = `${self.name}.${account.name}`;
            constructor() {
              super();
              this.addInput("publicKey", 0 as any);
              this.addInput("trigger", LiteGraph.ACTION);

              account.type.fields.forEach((field) => {
                this.addOutput(field.name, 0 as any);
              });
            }
            onAction() {
              workspace.account
                .counter(this.getInputData(0))
                .then((data) => {
                  Object.entries(data).forEach(([k, v]) => {
                    const i = this.outputs.findIndex((o) => o.name === k);
                    if (i >= 0) {
                      this.setOutputData(i, v);
                    } else {
                      console.log(`output not found: ${k}`);
                    }
                  });

                  this.bgcolor = "green";
                })
                .catch((err) => {
                  this.bgcolor = "red";
                  console.error(err);
                });
            }
          }
          LiteGraph.registerNodeType(`${self.name}/${account.name}`, Account);
          if (isNew) {
            self.nodes.push(`${self.name}/${account.name}`);
          }

          class CreateInstruction extends WorkspaceNode {
            title = `${self.name}.${account.name}.createInstruction`;

            constructor() {
              super();
              this.addInput("signer", 0 as any);
              this.addInput("sizeOverride", 0 as any);

              this.addOutput("", 0 as any);
            }
            onExecute() {
              try {
                this.bgcolor = "";

                workspace.account.counter
                  .createInstruction(this.getInputData(0))
                  .then((data) => {
                    this.setOutputData(0, data);
                    this.bgcolor = "green";
                  })
                  .catch((err) => {
                    console.error(err);
                    this.bgcolor = "red";
                  });
              } catch (err) {
                console.error(err);
                this.bgcolor = "red";
              }
            }
          }
          LiteGraph.registerNodeType(
            `${self.name}/${account.name}/createInstruction`,
            CreateInstruction
          );
          if (isNew)
            self.nodes.push(`${self.name}/${account.name}/createInstruction`);
        });

        const makeNode = instructionOrMethodNodeFactory(
          workspace,
          self.name,
          (x) => {
            if (isNew) self.nodes.push(x);
          }
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
