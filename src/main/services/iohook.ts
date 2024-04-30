import { uIOhook } from "uiohook-napi";
import { broadcastEvent } from "./window";
import { GlobalEventEnum } from "@share/enum";

export const initIoHook = () => {
  uIOhook.on("click", (event) => {
    broadcastEvent(GlobalEventEnum.Click, event);
  });
  uIOhook.start();
};
