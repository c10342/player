import { onBeforeUnmount } from "vue";
import { player } from "../player";

export const useEvent = (name: string, action: (...args: any) => any) => {
  player.on(name, action);

  onBeforeUnmount(() => {
    player.off(name, action);
  });
};

export const triggerEvent = (name: string, ...args: any) => {
  player.trigger(name, ...args);
};
