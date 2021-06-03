import { onSnapshot, types } from "mobx-state-tree";
import Connection from "./Connection";

const Store = types.model({
  connection: Connection,
});

const KEY = "cache";

const initialData = (() => {
  try {
    const data = JSON.parse(localStorage.getItem(KEY));
    if (Object.keys(data).length > 0) return data;
  } catch (err) {
  } finally {
    return {
      connection: {},
    };
  }
})();

export const store = Store.create(initialData);

onSnapshot(store, (snapshot) => {
  localStorage.setItem(KEY, JSON.stringify(snapshot));
});
