import { onBeforeUnmount } from "vue";
import vlcPlayer, { VlcEventListener, VlcEventType } from "../player";

export const usePlayerEvent = (event: VlcEventType, listener: VlcEventListener) => {
  vlcPlayer.on(event, listener);
  onBeforeUnmount(() => {
    vlcPlayer.off(event, listener);
  });
};
