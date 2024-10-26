import player from "@renderer/player";
import { FunType } from "@renderer/types";
import { onBeforeUnmount } from "vue";

export const usePlayer = () => {
  const addEvent = (name: string, action: FunType) => {
    player.on(name, action);
    onBeforeUnmount(() => {
      player.off(name, action);
    });
  };

  return { addEvent };
};
