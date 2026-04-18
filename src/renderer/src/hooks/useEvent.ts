import player, { VlcEventType, VlcEventListener } from "@renderer/player";
import { onBeforeUnmount } from "vue";

export const useIpcEvent = (name: string, action: (...args: any[]) => any) => {
  window.electronAPI.ipcOn(name, action);
  onBeforeUnmount(() => {
    window.electronAPI.ipcOff(name, action);
  });
};

export const usePlayerEvent = (event: VlcEventType, listener: VlcEventListener) => {
  player.on(event, listener);
  onBeforeUnmount(() => {
    player.off(event, listener);
  });
};

export const useWindowEvent = (event: keyof WindowEventMap, listener: (...args: any[]) => any) => {
  window.addEventListener(event, listener);
  onBeforeUnmount(() => {
    window.removeEventListener(event, listener);
  });
};
