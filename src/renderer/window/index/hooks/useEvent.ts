import { EventBus } from "@renderer/services/utils/eventBus";
import { onBeforeUnmount } from "vue";

const eventbus = new EventBus();

export const useEvent = (name: string, action: (...args: any) => any) => {
  eventbus.on(name, action);

  onBeforeUnmount(() => {
    eventbus.off(name, action);
  });
};

export const triggerEvent = (name: string, ...args: any) => {
  eventbus.trigger(name, ...args);
};
