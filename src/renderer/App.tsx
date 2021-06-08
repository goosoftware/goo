import React from "react";
import { Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./base.css";
import "./index.css";
import "./lib/defaultNodes";
import Editor from "./pages/Editor";
import { Sidebar } from "./pages/Layout";
import Solana from "./pages/Settings/Solana";
import Workspace from "./pages/Workspace";
import WorkspaceMenu from "./pages/WorkspaceMenu";

const App = () => (
  <>
    <div className="h-screen flex overflow-hidden bg-white dark:bg-gray-900">
      <Sidebar />
      <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
        <div className="flex-1 relative z-0 flex overflow-hidden">
          <Switch>
            <Route exact path="/">
              <Editor />
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
