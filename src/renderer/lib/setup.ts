import camelCase from "camelcase";
import glob from "glob";
import { app } from "../models/App";
import "./defaultNodes";

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
        app.addWorkspace(name);
      }
    });
  });
};

export const openProject = (dir: string) => {
  process.env.PROJECT_ROOT = dir;
  findWorkspaces();
};
