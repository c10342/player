import { autoUpdater } from "electron-updater";
import { BrowserWindow } from "electron";
import { GlobalEventEnum } from "@share/enum";
import log from "./logger";

export const initUpdater = () => {
  autoUpdater.autoDownload = false;
  autoUpdater.autoRunAppAfterInstall = true;
  autoUpdater.logger = log;

  autoUpdater.on("checking-for-update", () => {
    log.info("[Updater] Checking for update...");
  });

  autoUpdater.on("update-available", (info) => {
    log.info("[Updater] Update available:", info.version);
    for (const win of BrowserWindow.getAllWindows()) {
      win.webContents.send(GlobalEventEnum.UpdateAvailable, info);
    }
  });

  autoUpdater.on("update-not-available", (info) => {
    log.info("[Updater] Update not available. Current version:", info.version);
    for (const win of BrowserWindow.getAllWindows()) {
      win.webContents.send(GlobalEventEnum.UpdateNotAvailable, info);
    }
  });

  autoUpdater.on("download-progress", (progressInfo) => {
    log.info(`[Updater] Download progress: ${progressInfo.percent.toFixed(1)}%`);
    for (const win of BrowserWindow.getAllWindows()) {
      win.webContents.send(GlobalEventEnum.UpdateDownloadProgress, progressInfo);
    }
  });

  autoUpdater.on("update-downloaded", (info) => {
    log.info("[Updater] Update downloaded:", info.version);
    for (const win of BrowserWindow.getAllWindows()) {
      win.webContents.send(GlobalEventEnum.UpdateDownloaded, info);
    }
  });

  autoUpdater.on("error", (error) => {
    log.error("[Updater] Error:", error?.message);
    for (const win of BrowserWindow.getAllWindows()) {
      win.webContents.send(GlobalEventEnum.UpdateError, { message: error?.message });
    }
  });
};

export const checkForUpdate = () => {
  autoUpdater.checkForUpdates().catch((err) => {
    log.error("[Updater] checkForUpdates failed:", err);
  });
};

export const downloadUpdate = () => {
  autoUpdater.downloadUpdate().catch((err) => {
    log.error("[Updater] downloadUpdate failed:", err);
  });
};

export const installUpdate = () => {
  autoUpdater.quitAndInstall(false, true);
};
