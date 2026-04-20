import { BridgeEnum, GlobalEventEnum, LocaleEnum } from "@share/enum";
import { OpenDialogParams } from "@share/type";
import { BrowserWindow, dialog, ipcMain } from "electron";
import { setLocale } from "./i18n";

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
  // 窗口是否最大化
  ipcMain.handle(BridgeEnum.IsMaximized, (event) => {
    return BrowserWindow.fromWebContents(event.sender)?.isMaximized() ?? false;
  });
  // 关闭窗口
  ipcMain.on(BridgeEnum.CloseWindow, (event) => {
    BrowserWindow.fromWebContents(event.sender)?.close();
  });
  // 打开文件弹框
  ipcMain.handle(BridgeEnum.OpenDialog, (event, params: OpenDialogParams) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (params.modal && win) {
      return dialog.showOpenDialog(win, params);
    }
    return dialog.showOpenDialog(params);
  });
  // 设置语言
  ipcMain.on(BridgeEnum.SetLocale, (_event, locale: string) => {
    if (Object.values(LocaleEnum).includes(locale as LocaleEnum)) {
      setLocale(locale);
      for (const win of BrowserWindow.getAllWindows()) {
        win.webContents.send(GlobalEventEnum.LocaleChanged, locale);
      }
    }
  });
};
