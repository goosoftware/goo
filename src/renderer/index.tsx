// TODO: this doesn't load when you'd expect because esbuild is strange
// require("litegraph.js").LiteGraph.clearRegisteredTypes();
require("json-circular-stringify");

import React from "react";
import { render } from "react-dom";
import { HashRouter as Router } from "react-router-dom";
import App from "./App";

render(
  <Router>
    <App />
  </Router>,
  document.getElementById("root")
);
