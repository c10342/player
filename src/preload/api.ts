import { BridgeEnum } from "@share/enum";
import { ipcRenderer } from "electron";

const api = {
  [BridgeEnum.GetFileName](url: string): Promise<string> {
    return ipcRenderer.invoke(BridgeEnum.GetFileName, url);
  }
};

export default api;
