import * as anchor from "@project-serum/anchor";
import React from "react";
import { render } from "react-dom";
import { App } from "./App";
import "./index.css";
import { openProject } from "./lib/setup";

document.addEventListener("drop", (event) => {
  event.preventDefault();
  event.stopPropagation();

  try {
    anchor.setProvider(anchor.Provider.env());
  } catch (err) {}

  for (const f of event.dataTransfer.files) {
    // Using the path attribute to get absolute file path
    console.log("File Path of dragged files: ", f.path);

    // openProject("/Users/john/Code/johnrees/anchor/examples/chat");
    openProject(f.path);
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

render(<App />, document.getElementById("root"));
