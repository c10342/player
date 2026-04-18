import { BridgeEnum } from "@share/enum";
import { BrowserWindow, ipcMain } from "electron";

export const initBridge = () => {
  // 根据url获取文件名
  ipcMain.on(BridgeEnum.MaximizeWindow, (event) => {
    BrowserWindow.fromWebContents(event.sender)?.maximize();
  });
  // 最小化窗口
  ipcMain.on(BridgeEnum.MinimizeWindow, (event) => {
    BrowserWindow.fromWebContents(event.sender)?.minimize();
  });
  // 还原窗口
  ipcMain.on(BridgeEnum.RestoreWindow, (event) => {
    BrowserWindow.fromWebContents(event.sender)?.unmaximize();
  });
  // 关闭窗口
  ipcMain.on(BridgeEnum.CloseWindow, (event) => {
    BrowserWindow.fromWebContents(event.sender)?.close();
  });
};
