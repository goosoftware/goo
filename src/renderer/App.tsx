import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClusterSelector from "./components/ClusterSelector";
import Workspaces from "./components/Workspaces";
import Editor from "./Editor";
import "./lib/setup";
import useAnchor from "./lib/useAnchor";

export function App() {
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
      <Workspaces />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        closeOnClick
        pauseOnFocusLoss
        pauseOnHover
        // hideProgressBar={false}
        // newestOnTop={false}
        // rtl={false}
        // draggable
      />
    </div>
  );
}
