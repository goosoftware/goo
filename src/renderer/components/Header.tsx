import { Jazzicon } from "@ukstv/jazzicon-react";
import { observer } from "mobx-react-lite";
import React from "react";
import { Link } from "react-router-dom";
import { State } from "../models/Connection";
import { store } from "../models/Store";

const ConnectionButton = observer(() => {
  if (store.connection.state === State.connected) {
    return <button onClick={store.connection.disconnect}>disconnect</button>;
  } else if (store.connection.state === State.disconnected) {
    return <button onClick={store.connection.connect}>connect</button>;
  } else {
    return <button disabled>{store.connection.state}</button>;
  }
});

const reset = () => {
  localStorage.clear();
  window.location.reload();
};

const Header = observer(() => (
  <header style={{ color: store.connection.color }}>
    <Link to="/">home</Link>
    <Link to="/workspaces">workspaces</Link>
    {store.connection.cluster} <ConnectionButton />
    <button onClick={reset}>reset</button>
    {store.shortUserPublicKey}
    <div
      style={{
        width: 20,
        height: 20,
        margin: 0,
        padding: 0,
      }}
    >
      <Jazzicon address={store.userPublicKey} />
    </div>
  </header>
));

export default Header;
