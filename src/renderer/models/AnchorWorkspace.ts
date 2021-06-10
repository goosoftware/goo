import { GooNode } from "@goosoftware/goo";
import * as anchor from "@project-serum/anchor";
import camelCase from "camelcase";
import fs from "fs";
import glob from "glob";
import { LiteGraph } from "litegraph.js";
import { flow, getRoot, types } from "mobx-state-tree";
import path from "path";

const t = types;

// https://transform.tools/json-to-mobx-state-tree
const IDL = t.model({
  version: t.string,
  name: t.string,
  instructions: t.array(
    t.model({
      name: t.string,
      accounts: t.array(
        t.model({
          name: t.string,
          isMut: t.boolean,
          isSigner: t.boolean,
        })
      ),
      args: t.array(
        t.model({
          name: t.string,
          type: t.string,
        })
      ),
    })
  ),
  accounts: t.array(
    t.model({
      name: t.string,
      type: t.model({
        kind: t.string,
        fields: t.array(
          t.model({
            name: t.string,
            type: t.string,
          })
        ),
      }),
    })
  ),
  metadata: t.maybe(
    t.model({
      address: t.string,
    })
  ),
});

const AnchorWorkspace = types
  .model({
    id: types.identifier,
    idl: IDL,
    // address: types.maybe(types.string),
    path: types.string,
    nodes: types.optional(types.array(types.string), []),
  })
  .views((self) => ({
    get address(): string | undefined {
      return self.idl.metadata?.address;
    },
    get version(): string {
      return self.idl.version;
    },
    get name(): string {
      return camelCase(self.idl.name, { pascalCase: true });
    },
    get state(): string {
      return (self as any).address ? "deployed" : "unbuilt";
    },
    get action() {
      return "build";
    },
  }))
  .actions((self) => {
    return {
      build: flow(function* () {
        console.log("build!");
      }),
      remove() {
        (getRoot(self) as any).removeWorkspace(self.id);
      },
      beforeDestroy() {
        self.nodes.forEach((node) => {
          console.log("removing ", node);
          LiteGraph.unregisterNodeType(node);
        });
      },
      afterAttach() {
        if (self.address && self.path && self.name) {
          process.env.PROJECT_ROOT = self.path;
          parseWorkspace(self.name);
        }
      },
    };
  });

export default AnchorWorkspace;

const read = (path: string): Promise<[string, object]> =>
  new Promise((res, rej) => {
    fs.readFile(path, (err, file) => {
      if (err) rej(err);
      const idl = JSON.parse(file.toString());
      const name = camelCase(idl.name, { pascalCase: true });
      res([name, idl]);
    });
  });

const aGlob = (pattern: string): Promise<string[]> =>
  new Promise((res, rej) => {
    glob(pattern, function (err, files) {
      if (err) rej(err);
      res(files);
    });
  });

// from anchor.workspace, TODO: use that code instead
export const findWorkspaces = async (projectRoot: string) => {
  while (!fs.existsSync(path.join(projectRoot, "Anchor.toml"))) {
    const parentDir = path.dirname(projectRoot);
    if (parentDir === projectRoot) {
      projectRoot = undefined;
    }
    projectRoot = parentDir;
  }

  if (projectRoot === undefined) {
    throw new Error("Could not find workspace root.");
  }

  const files = await aGlob(`${projectRoot}/target/idl/*.json`);
  return Promise.all(files.map((path) => read(path)));
};

class WorkspaceNode extends GooNode {
  static title_color = "#0eaf9b";
}

export const parseWorkspace = (workspace: string) => {
  const program = anchor.workspace[workspace];

  if (!program) return;

  const idl = program._idl as anchor.Idl;

  idl.accounts?.forEach((account) => {
    class Account extends WorkspaceNode {
      title = `${workspace}.${account.name}`;
      private ee: any;

      constructor() {
        super();
        this.addInput("publicKey", "publicKey", {
          shape: LiteGraph.ARROW_SHAPE,
        });
        // this.addInput("trigger", LiteGraph.ACTION);

        account.type.fields.forEach((field) => {
          this.addOutput(field.name, 0 as any);
        });

        this.handleChange = this.handleChange.bind(this);
      }

      run() {
        const pk = this.getInputData(0);
        this.ee?.removeListener("change", this.handleChange);
        this.ee = program.account[camelCase(account.name)].subscribe(pk);
        this.ee.on("change", this.handleChange);
      }

      // onAction() {
      //   program.account
      //     .counter(this.getInputData(0))
      //     .then((data) => {
      //       this.handleChange(data);
      //     })
      //     .catch((err) => {
      //       this.bgcolor = "red";
      //       console.error(err);
      //     });
      // }

      private handleChange(data) {
        Object.entries(data).forEach(([k, v]) => {
          const i = this.outputs.findIndex((o) => o.name === k);
          if (i >= 0) {
            this.setOutputData(i, v);
          } else {
            console.log(`output not found: ${k}`);
          }
        });
        this.onSuccess();
      }
    }
    LiteGraph.registerNodeType(`anchor/${workspace}/${account.name}`, Account);

    class CreateInstruction extends WorkspaceNode {
      title = `${workspace}.${account.name}.createInstruction`;
      constructor() {
        super();
        this.addInput("signer", 0 as any);
        this.addInput("sizeOverride", 0 as any);

        this.addOutput("instruction", 0 as any, { label: "" });
      }

      async run() {
        const inputData = this.getInputData(0);

        const data = await program.account[
          camelCase(account.name)
        ].createInstruction(inputData);

        this.setOutputData(0, data);
      }
    }
    LiteGraph.registerNodeType(
      `anchor/${workspace}/${account.name}/createInstruction`,
      CreateInstruction
    );
  });

  const instructionOrMethodNodeFactory = (instruction) => {
    class InstructionNode extends WorkspaceNode {
      title = [workspace, instruction.name].join(".");

      constructor() {
        super();
        instruction.args.forEach((arg) => {
          if (arg.type === "publicKey") {
            this.addInput(arg.name, "publicKey", {
              shape: LiteGraph.ARROW_SHAPE,
            });
          } else {
            this.addInput(arg.name, 0 as any);
          }
        });
        instruction.accounts.forEach((acc) => {
          this.addInput(acc.name, 0 as any, { shape: LiteGraph.ARROW_SHAPE });
        });
        this.addInput("signers", 0 as any);
        this.addInput("instructions", 0 as any);
        this.addInput("trigger", LiteGraph.ACTION);

        this.addOutput("transaction", 0 as any, { label: "" });
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

          console.log({ ob });

          if (ob.args?.length > 0) {
            program.rpc[instruction.name](...ob.args, {
              accounts: ob.accounts,
              signers: ob.signers,
              instructions: ob.instructions,
            })
              .then(this.onSuccess)
              .catch(this.onFailure);
          } else {
            program.rpc[instruction.name]({
              accounts: ob.accounts,
              signers: ob.signers,
              instructions: ob.instructions,
            })
              .then(this.onSuccess)
              .catch(this.onFailure);
          }
        } catch (err) {
          this.onFailure(err);
        }
      }
    }
    LiteGraph.registerNodeType(
      `anchor/${workspace}/${instruction.name}`,
      InstructionNode
    );
  };

  idl.instructions.forEach(instructionOrMethodNodeFactory);
  idl.state?.methods.forEach(instructionOrMethodNodeFactory);
};
