import "base.css";
import Sidebar from "components/Sidebar";
import "index.css";
import "nodes";
import Anchor from "pages/Anchor";
import Editor from "pages/Editor";
import Solana from "pages/Solana";
import React from "react";
import { Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";

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
              <Anchor />
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
