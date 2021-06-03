import { observer } from "mobx-react-lite";
import React from "react";
import { render } from "react-dom";
import { HashRouter as Router, Link, Route, Switch } from "react-router-dom";
import Header from "./components/Header";
import { store } from "./models/Store";
import Workspace from "./pages/Workspace";

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

const AnchorWorkspaces = observer(() => (
  <ul>
    {store.sortedWorkspaces.map((ws) => (
      <li key={ws.id}>
        <Link to={`/workspaces/${ws.id}`}>{ws.id}</Link>
      </li>
    ))}
  </ul>
));

const App = () => (
  <Router>
    <div>
      <br />
      <Link to="/">home</Link>
      <Header />
      <AnchorWorkspaces />
    </div>
    <Switch>
      <Route exact path="/">
        <h1>hello</h1>
      </Route>
      <Route exact path="/foo">
        <h1>foo</h1>
      </Route>
      <Route exact path="/workspaces/:id">
        <Workspace />
      </Route>
    </Switch>
  </Router>
);

render(<App />, document.getElementById("root"));
