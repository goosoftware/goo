import React from "react";
import { render } from "react-dom";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import "./base.css";
import Header from "./components/Header";
import "./index.css";
import { store } from "./models/Store";
import Editor from "./pages/Editor";
import Layout from "./pages/Layout";
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

document.addEventListener("dragenter", (event) => {
  console.log("File is in the Drop Space");
});

document.addEventListener("dragleave", (event) => {
  console.log("File has left the Drop Space");
});

const App = () => (
  <Router>
    <>
      <Header />
    </>
    <Switch>
      <Route exact path="/">
        <Editor />
      </Route>
      <Route exact path="/workspaces">
        <WorkspaceMenu />
      </Route>
      <Route exact path="/workspaces/:id">
        <Workspace />
      </Route>
    </Switch>
  </Router>
);

render(<Layout />, document.getElementById("root"));
