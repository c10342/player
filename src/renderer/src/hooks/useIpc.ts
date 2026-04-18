import { onBeforeUnmount } from "vue";

export const useIpcOn = (name: string, action: (...args: any[]) => any) => {
  window.electronAPI.ipcOn(name, action);
  onBeforeUnmount(() => {
    window.electronAPI.ipcOff(name, action);
  });
};
