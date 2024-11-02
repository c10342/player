import { BridgeEnum } from "@share/enum";
import { ShowOpenDialogParrams } from "@share/type";
import { BrowserWindow, dialog, ipcMain, screen } from "electron";
import path from "path";

export const initBridge = () => {
  // 根据url获取文件名
  ipcMain.handle(BridgeEnum.GetFileName, (_event, url: string) => {
    return path.basename(url);
  });
  // 获取鼠标位置
  ipcMain.handle(BridgeEnum.GetMousePosition, () => {
    const cursor = screen.getCursorScreenPoint();
    return cursor;
  });
  // 打开文件弹框
  ipcMain.handle(BridgeEnum.ShowOpenDialog, (event, params: ShowOpenDialogParrams) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (params.modal && win) {
      return dialog.showOpenDialog(win, params);
    }
    return dialog.showOpenDialog(params);
  });
};
