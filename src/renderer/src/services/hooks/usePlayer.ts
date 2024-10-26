import player from "@renderer/player";
import { FunType } from "@renderer/types";
import { onBeforeUnmount } from "vue";

export const usePlayerEvent = (name: string, action: FunType) => {
  player.on(name, action);
  onBeforeUnmount(() => {
    player.off(name, action);
  });
};
