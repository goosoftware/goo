import { app, BrowserWindow } from "electron";
import { is } from "electron-util";
import path from "path";
import { format } from "url";

let win: BrowserWindow | null = null;

async function createWindow() {
  win = new BrowserWindow({
    width: 1050,
    height: 700,
    minHeight: 600,
    minWidth: 650,
    webPreferences: {
      nodeIntegration: true,
      devTools: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
    show: false,
    titleBarStyle: "hidden",
  });

  const isDev = is.development;

  if (isDev) {
    win.loadURL("http://localhost:9080");
  } else {
    win.loadURL(
      format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file",
        slashes: true,
      })
    );
  }

  win.on("closed", () => {
    win = null;
  });

  win.webContents.on("devtools-opened", () => {
    win!.focus();
  });

  win.on("ready-to-show", () => {
    win!.show();
    win!.focus();
  });

  // TODO: reimplement this, it disables inspector atm
  //
  // Menu.setApplicationMenu(
  //   Menu.buildFromTemplate([
  //     {
  //       label: "File",
  //       submenu: [
  //         {
  //           label: "Exit",
  //           click() {
  //             app.quit();
  //           },
  //         },
  //       ],
  //     },
  //   ])
  // );
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (!is.macos) {
    app.quit();
  }
});

app.on("activate", () => {
  if (win === null && app.isReady()) {
    createWindow();
  }
});
