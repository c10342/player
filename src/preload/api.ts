import { BridgeEnum } from "@share/enum";
import { ipcRenderer, Point } from "electron";

const api = {
  [BridgeEnum.GetFileName](url: string): Promise<string> {
    return ipcRenderer.invoke(BridgeEnum.GetFileName, url);
  },
  [BridgeEnum.GetMousePosition](): Promise<Point> {
    return ipcRenderer.invoke(BridgeEnum.GetMousePosition);
  }
};

export default api;
