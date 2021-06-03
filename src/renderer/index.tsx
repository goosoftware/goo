import { observer } from "mobx-react-lite";
import React from "react";
import { render } from "react-dom";
import {
  HashRouter as Router,
  Link,
  Redirect,
  Route,
  Switch,
  useParams,
} from "react-router-dom";
import Header from "./components/Header";
import { store } from "./models/Store";

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
    {[...store.anchorWorkspaces.values()].map((ws) => (
      <li key={ws.id}>
        <Link to={`/workspaces/${ws.id}`}>{ws.id}</Link>
      </li>
    ))}
  </ul>
));

const App = () => (
  <Router>
    <div>
      <Header />
      <AnchorWorkspaces />
    </div>
    <Link to="/">home</Link>
    <Link to="/foo">foo</Link>
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

const Workspace = observer(() => {
  let { id } = useParams<{ id: string }>();

  const workspace = store.anchorWorkspaces.get(id);

  if (!workspace) return <Redirect to="/" />;

  return (
    <div>
      <h3>ID: {id}</h3>
      <pre>{JSON.stringify(workspace.toJSON(), null, 2)}</pre>
    </div>
  );
});

render(<App />, document.getElementById("root"));
