import * as anchor from "@project-serum/anchor";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../lib/setup";
import { openProject } from "../lib/setup";
import useAnchor from "../lib/useAnchor";
import ClusterSelector from "./ClusterSelector";
import Editor from "./Editor";
// import Workspaces from "./Workspaces";

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

function App() {
  const { user } = useAnchor();

  return (
    <div>
      <header>
        {user?.publicKey.toString()}
        <ClusterSelector />
      </header>
      <div>
        <Editor />
      </div>
      {/* <Workspaces /> */}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        closeOnClick
        pauseOnFocusLoss
        pauseOnHover
      />
    </div>
  );
}

export default App;
