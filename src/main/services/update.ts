import { is } from "@electron-toolkit/utils";
import { GlobalEventEnum } from "@share/enum";
import { BrowserWindow } from "electron";
import { autoUpdater } from "electron-updater";

const broadcastEvent = (eventName: GlobalEventEnum, ...args: any[]) => {
  const wins = BrowserWindow.getAllWindows();
  wins.forEach((win) => {
    win.webContents.send(eventName, ...args);
  });
};

/**
 * 初始化自动更新
 */
export const initUpdate = () => {
  // 自动下载
  autoUpdater.autoDownload = true;
  // 应用退出后自动安装
  // autoUpdater.autoInstallOnAppQuit = true;
  if (is.dev) {
    // 开启开发环境调试
    autoUpdater.forceDevUpdateConfig = true;
  }
  //   有版本需要更新
  autoUpdater.on("update-available", (info) => {
    broadcastEvent(GlobalEventEnum.UpdateAvailable, info);
  });
  //   无需更新
  autoUpdater.on("update-not-available", (info) => {
    broadcastEvent(GlobalEventEnum.UpdateNotAvailable, info);
  });
  //   下载进度
  autoUpdater.on("download-progress", (prog) => {
    broadcastEvent(GlobalEventEnum.DownloadProgress, prog);
  });
  //   下载完成
  autoUpdater.on("update-downloaded", (info) => {
    broadcastEvent(GlobalEventEnum.UpdateDownloaded, info);
  });
};

/**
 * 检测是否有更新包
 * @returns
 */
export const checkUpdate = () => {
  // 检测是否有更新包并通知
  // return autoUpdater.checkForUpdatesAndNotify({
  //   body: "有更新",
  //   title: "提示"
  // });
  return autoUpdater.checkForUpdates();
};

/**
 * 安装更新
 */
export const installUpdate = () => {
  autoUpdater.quitAndInstall();
};
