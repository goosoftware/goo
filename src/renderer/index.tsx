import { observer } from "mobx-react-lite";
import React from "react";
import { render } from "react-dom";
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
      <li key={ws.id}>{ws.id}</li>
    ))}
  </ul>
));

const App = () => (
  <div>
    <Header />
    <AnchorWorkspaces />
  </div>
);

render(<App />, document.getElementById("root"));
