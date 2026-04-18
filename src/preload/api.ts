import { BridgeEnum } from "@share/enum";
import { OpenDialogParams } from "@share/type";
import { ipcRenderer } from "electron";

const api = {
  ipcOn(name: string, action: (...args: any[]) => any) {
    ipcRenderer.on(name, action);
  },
  ipcOff(name: string, action: (...args: any[]) => any) {
    ipcRenderer.off(name, action);
  },
  ipcOnce(name: string, action: (...args: any[]) => any) {
    ipcRenderer.once(name, action);
  },
  [BridgeEnum.MaximizeWindow]() {
    ipcRenderer.send(BridgeEnum.MaximizeWindow);
  },
  [BridgeEnum.MinimizeWindow]() {
    ipcRenderer.send(BridgeEnum.MinimizeWindow);
  },
  [BridgeEnum.RestoreWindow]() {
    ipcRenderer.send(BridgeEnum.RestoreWindow);
  },
  [BridgeEnum.CloseWindow]() {
    ipcRenderer.send(BridgeEnum.CloseWindow);
  },
  [BridgeEnum.OpenDialog](params: OpenDialogParams): Promise<Electron.OpenDialogReturnValue> {
    return ipcRenderer.invoke(BridgeEnum.OpenDialog, params);
  }
};

export default api;
