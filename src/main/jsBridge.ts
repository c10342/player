import { BridgeEnum } from "@share/enum";
import { ipcMain, screen } from "electron";
import path from "path";

export const initJsBridge = () => {
  ipcMain.handle(BridgeEnum.GetFileName, (_event, url: string) => {
    return path.basename(url);
  });
  ipcMain.handle(BridgeEnum.GetMousePosition, () => {
    const cursor = screen.getCursorScreenPoint();
    return cursor;
  });
};
