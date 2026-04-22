import { app, BrowserWindow } from "electron";

import { electronApp, optimizer } from "@electron-toolkit/utils";
import { initBridge } from "./bridge";
import { initLogger } from "./logger";
import { initI18n } from "./i18n";
import { initUpdater } from "./updater";
import { createWindow } from "./window";
import { createTray } from "./tray";

let mainWin: BrowserWindow | null = null;

function createPlayerWindow() {
  mainWin = createWindow("player", {
    minWidth: 700,
    minHeight: 500,
    webPreferences: {
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: false
    }
  });
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId("com.electron");

  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });
  initLogger();
  initI18n();
  initBridge();
  initUpdater();
  createPlayerWindow();
  createTray(mainWin);

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createPlayerWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
