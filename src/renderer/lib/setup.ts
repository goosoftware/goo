import * as anchor from "@project-serum/anchor";
import camelCase from "camelcase";
import glob from "glob";
import { LGraphNode, LiteGraph } from "litegraph.js";
import { app } from "../models/App";
import "./defaultNodes";

const parseWorkspace = (workspace: string) => {
  console.log({ found: workspace });

  const program = anchor.workspace[workspace];
  console.log({ program });
  const idl = program._idl as anchor.Idl;
  console.log({ idl });

  app.addWorkspace(workspace);

  class WorkspaceNode extends LGraphNode {
    static title_color = "#0eaf9b";
  }

  idl.accounts?.forEach((account) => {
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
    LiteGraph.registerNodeType(`${workspace}/${account.name}`, Account);

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
      `${workspace}/${account.name}/createInstruction`,
      CreateInstruction
    );
  });

  const instructionOrMethodNodeFactory = (instruction) => {
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
      `${workspace}/${instruction.name}`,
      InstructionNode
    );
  };

  idl.instructions.forEach(instructionOrMethodNodeFactory);
  idl.state?.methods.forEach(instructionOrMethodNodeFactory);
};

// from anchor.workspace, TODO: use that code instead

const findWorkspaces = () => {
  // const find = require("find"); // not working?
  const fs = require("fs");
  const process = require("process");
  const path = require("path");

  let projectRoot = process.env.PROJECT_ROOT ?? process.cwd();

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

  glob(`${projectRoot}/target/idl/*.json`, function (er, files) {
    files.forEach((path) => {
      const idlStr = fs.readFileSync(path);
      console.log(path);
      const idl = JSON.parse(idlStr);
      const name = camelCase(idl.name, { pascalCase: true });
      if (idl.metadata && idl.metadata.address) {
        parseWorkspace(name);
      }
    });
  });
};

export const openProject = (dir: string) => {
  process.env.PROJECT_ROOT = dir;
  findWorkspaces();
};
