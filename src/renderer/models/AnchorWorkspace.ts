import camelCase from "camelcase";
import fs from "fs";
import glob from "glob";
import { types } from "mobx-state-tree";
import path from "path";
// import "./defaultNodes";

const AnchorWorkspace = types.model({
  id: types.identifier,
  address: types.maybe(types.string),
  path: types.string,
});

export default AnchorWorkspace;

// try {
//   anchor.setProvider(anchor.Provider.env());
// } catch (err) {}
// Using the path attribute to get absolute file path
// console.log(file.path);
// const workspace = AnchorWorkspace.create({});
// console.log(workspace);

const read = (path: string): Promise<[string, string?]> =>
  new Promise((res, rej) => {
    fs.readFile(path, (err, file) => {
      if (err) rej(err);
      const idl = JSON.parse(file.toString());
      const name = camelCase(idl.name, { pascalCase: true });
      if (idl.metadata && idl.metadata.address) {
        // app.addWorkspace(name);
        res([name, idl.metadata.address]);
      } else {
        res([name]);
      }
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
