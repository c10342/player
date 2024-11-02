import { BridgeEnum } from "@share/enum";
import { ShowOpenDialogParrams } from "@share/type";
import { ipcRenderer, Point } from "electron";

const api = {
  [BridgeEnum.GetFileName](url: string): Promise<string> {
    return ipcRenderer.invoke(BridgeEnum.GetFileName, url);
  },
  [BridgeEnum.GetMousePosition](): Promise<Point> {
    return ipcRenderer.invoke(BridgeEnum.GetMousePosition);
  },
  [BridgeEnum.ShowOpenDialog](
    params: ShowOpenDialogParrams
  ): Promise<Electron.OpenDialogReturnValue> {
    return ipcRenderer.invoke(BridgeEnum.ShowOpenDialog, params);
  }
};

export default api;
