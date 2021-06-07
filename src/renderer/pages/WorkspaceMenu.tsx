import { spawn } from "child_process";
import { remote } from "electron";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { ExplorerLink } from "../components/ExternalLink";
import { store } from "../models/Store";

const WorkspaceMenu = () => {
  useEffect(() => {
    const handleDrop = (event) => {
      event.preventDefault();
      event.stopPropagation();

      for (const f of event.dataTransfer.files) {
        store.addFile(f);
      }
    };

    const handleOver = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };

    const handleEnter = () => {
      console.log("File is in the Drop Space");
    };

    const handleLeave = () => {
      console.log("File has left the Drop Space");
    };

    document.addEventListener("drop", handleDrop);
    document.addEventListener("dragover", handleOver);
    document.addEventListener("dragenter", handleEnter);
    document.addEventListener("dragleave", handleLeave);

    return () => {
      document.removeEventListener("drop", handleDrop);
      document.removeEventListener("dragover", handleOver);
      document.removeEventListener("dragenter", handleEnter);
      document.removeEventListener("dragleave", handleLeave);
    };
  });

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h4 className="text-lg font-semibold text-gray-300">
          {store.anchorCliVersion}
        </h4>

        <div>
          <h1 className="py-4 text-2xl font-semibold text-gray-900">
            Workspaces
          </h1>
          <button>import</button>
          <button
            onClick={async () => {
              try {
                const { filePaths } = await remote.dialog.showOpenDialog(
                  remote.getCurrentWindow(),
                  {
                    properties: ["openDirectory", "createDirectory"],
                    title: "directory",
                    buttonLabel: "do it",
                  }
                );

                spawn(`anchor init test`, {
                  cwd: filePaths[0],
                  shell: true,
                });

                // console.log(filePaths[0]);
              } catch (err) {
                console.error(err);
              }
            }}
          >
            add file
          </button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden sm:rounded-lg">
                <table className="min-w-full">
                  <tbody>
                    {store.sortedWorkspaces.map((workspace, idx) => (
                      <tr
                        key={workspace.name}
                        className={
                          idx % 2 === 0 ? "bg-white" : "dark:bg-gray-800"
                        }
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <h4 className="font-bold">{workspace.name}</h4>
                          <span className="dark:text-gray-400">
                            {workspace.path.replace(/\/Users\/[^/]+/, "~")}
                          </span>
                          <div>
                            {workspace.address && (
                              <ExplorerLink
                                path={`address/${workspace.address}`}
                                className="dark:text-gray-600"
                              >
                                {workspace.address}
                              </ExplorerLink>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {workspace.state}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <button
                            onClick={workspace[workspace.action]}
                            type="button"
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm dark:text-white dark:bg-gray-700 hover:text-solanaGreen"
                          >
                            {workspace.action}
                          </button>
                          <button
                            onClick={workspace[workspace.action]}
                            type="button"
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm dark:text-white dark:bg-gray-700 hover:text-solanaGreen"
                            disabled
                          >
                            deploy
                          </button>
                          <button
                            onClick={workspace.remove}
                            type="button"
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white hover:bg-red-200 dark:text-red-500 hover:text-white"
                          >
                            x
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(WorkspaceMenu);
