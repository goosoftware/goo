import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../lib/setup";
import useAnchor from "../lib/useAnchor";
import ClusterSelector from "./ClusterSelector";
import Editor from "./Editor";
// import Workspaces from "./Workspaces";

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
