import { shell, BrowserWindow } from "electron";
import { join } from "path";
import icon from "../../resources/icon.png?asset";
import { GlobalEventEnum } from "@share/enum";
import log from "./logger";
import { is } from "@electron-toolkit/utils";

export function createWindow(
  name: string,
  options?: Electron.BrowserWindowConstructorOptions | undefined
) {
  const win = new BrowserWindow({
    width: 900,
    height: 670,
    minWidth: 700,
    minHeight: 500,
    show: false,
    autoHideMenuBar: true,
    frame: false,
    titleBarStyle: "hidden",
    ...(process.platform === "linux" ? { icon } : {}),
    ...(options || {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
      // 关闭沙箱环境
      nodeIntegration: true,
      contextIsolation: false,
      ...(options?.webPreferences || {})
    }
  });

  win.on("ready-to-show", () => {
    win.show();
  });

  win.on("maximize", () => {
    win.webContents.send(GlobalEventEnum.MaximizeWindow);
  });
  win.on("unmaximize", () => {
    win.webContents.send(GlobalEventEnum.RestoreWindow);
  });
  win.on("minimize", () => {
    win.webContents.send(GlobalEventEnum.MinimizeWindow);
  });

  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  win.webContents.on("render-process-gone", (_event, details) => {
    log.error("Renderer process gone:", details);
  });

  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    // http://localhost:5173/pages/player/index.html
    win.loadURL(`${process.env["ELECTRON_RENDERER_URL"]}/pages/${name}/index.html`);
  } else {
    win.loadFile(join(__dirname, `../renderer/pages/${name}/index.html`));
  }
  return win;
}
