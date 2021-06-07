import camelCase from "camelcase";
import fs from "fs";
import glob from "glob";
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
  })
  .views((self) => ({
    get address(): string | undefined {
      return self.idl.metadata?.address;
    },
    get version(): string {
      return self.idl.version;
    },
    get name(): string {
      return self.idl.name;
    },
    get state(): string {
      return (self as any).address ? "deployed" : "unbuilt";
    },
    get action() {
      return "build";
    },
  }))
  .actions((self) => ({
    build: flow(function* () {
      console.log("build!");
    }),
    remove() {
      (getRoot(self) as any).removeWorkspace(self.id);
    },
  }));

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
