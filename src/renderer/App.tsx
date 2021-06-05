import React from "react";
import { Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./base.css";
import Editor from "./components/Editor";
import "./index.css";
import "./lib/defaultNodes";
import { store } from "./models/Store";
import { Sidebar } from "./pages/Layout";
import Solana from "./pages/Settings/Solana";
import Workspace from "./pages/Workspace";
import WorkspaceMenu from "./pages/WorkspaceMenu";

document.addEventListener("drop", (event) => {
  event.preventDefault();
  event.stopPropagation();

  for (const f of event.dataTransfer.files) {
    store.addFile(f);
  }
});

document.addEventListener("dragover", (e) => {
  e.preventDefault();
  e.stopPropagation();
});

document.addEventListener("dragenter", () => {
  console.log("File is in the Drop Space");
});

document.addEventListener("dragleave", () => {
  console.log("File has left the Drop Space");
});

const App = () => (
  <>
    <div className="h-screen flex overflow-hidden bg-white dark:bg-gray-900">
      <Sidebar />
      <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
        <div className="flex-1 relative z-0 flex overflow-hidden">
          <Switch>
            <Route exact path="/">
              <Editor />
              {/* <DirectoryList /> */}
            </Route>
            <Route exact path="/anchor">
              <WorkspaceMenu />
            </Route>
            <Route exact path="/anchor/:id">
              <Workspace />
            </Route>
            <Route exact path="/settings/solana">
              <Solana />
            </Route>
          </Switch>
        </div>
      </div>
    </div>
    <ToastContainer
      position="bottom-right"
      autoClose={5000}
      closeOnClick
      pauseOnFocusLoss
      pauseOnHover
    />
  </>
);

export default App;
