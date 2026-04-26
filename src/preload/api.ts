import { BridgeEnum } from "@share/enum";
import { OpenDialogParams } from "@share/type";
import { ipcRenderer } from "electron";

const api = {
  ipcOn(name: string, action: (event: Electron.IpcRendererEvent, ...args: any[]) => any) {
    ipcRenderer.on(name, action);
  },
  ipcOff(name: string, action: (event: Electron.IpcRendererEvent, ...args: any[]) => any) {
    ipcRenderer.off(name, action);
  },
  ipcOnce(name: string, action: (event: Electron.IpcRendererEvent, ...args: any[]) => any) {
    ipcRenderer.once(name, action);
  },
  ipcSend(name: string, ...args: any[]) {
    ipcRenderer.send(name, ...args);
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
  [BridgeEnum.IsMaximized](): Promise<boolean> {
    return ipcRenderer.invoke(BridgeEnum.IsMaximized);
  },
  [BridgeEnum.OpenDialog](params: OpenDialogParams): Promise<Electron.OpenDialogReturnValue> {
    return ipcRenderer.invoke(BridgeEnum.OpenDialog, params);
  },
  [BridgeEnum.SetLocale](locale: string): void {
    ipcRenderer.send(BridgeEnum.SetLocale, locale);
  },
  [BridgeEnum.GetAppVersion](): Promise<string> {
    return ipcRenderer.invoke(BridgeEnum.GetAppVersion);
  },
  [BridgeEnum.GetLocale](): Promise<string> {
    return ipcRenderer.invoke(BridgeEnum.GetLocale);
  },
  [BridgeEnum.CheckForUpdate](): void {
    ipcRenderer.send(BridgeEnum.CheckForUpdate);
  },
  [BridgeEnum.DownloadUpdate](): void {
    ipcRenderer.send(BridgeEnum.DownloadUpdate);
  },
  [BridgeEnum.InstallUpdate](): void {
    ipcRenderer.send(BridgeEnum.InstallUpdate);
  },
  [BridgeEnum.SetTrayPlaying](playing: boolean): void {
    ipcRenderer.send(BridgeEnum.SetTrayPlaying, playing);
  }
};

export default api;
