import { onBeforeUnmount } from "vue";

export const useIpcEvent = (
  name: string,
  action: (event: Electron.IpcRendererEvent, ...args: any[]) => any
) => {
  window.electronAPI.ipcOn(name, action);
  onBeforeUnmount(() => {
    window.electronAPI.ipcOff(name, action);
  });
};

export const useWindowEvent = (event: keyof WindowEventMap, listener: (...args: any[]) => any) => {
  window.addEventListener(event, listener);
  onBeforeUnmount(() => {
    window.removeEventListener(event, listener);
  });
};
