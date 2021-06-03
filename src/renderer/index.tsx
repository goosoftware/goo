import { observer } from "mobx-react-lite";
import React from "react";
import { render } from "react-dom";
// import "./base.css";
// import App from "./components/App";
import { store } from "./models/Store";

const ConnectionButton = observer(() => {
  if (store.connection.state === "connected") {
    return <button onClick={store.connection.disconnect}>disconnect</button>;
  } else if (store.connection.state === "disconnected") {
    return <button onClick={store.connection.connect}>connect</button>;
  } else {
    return <button disabled>{store.connection.state}</button>;
  }
});

const Header = observer(() => (
  <header style={{ color: store.connection.color }}>
    {store.connection.cluster} <ConnectionButton />
  </header>
));

const App = () => (
  <div>
    <Header />
  </div>
);

render(<App />, document.getElementById("root"));
