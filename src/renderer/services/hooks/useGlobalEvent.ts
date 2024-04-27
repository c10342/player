import { GlobalEventEnum } from "@share/enum";
import { onBeforeUnmount } from "vue";

/**
 * vue文件中使用，用于监听全局的事件
 * @param name 事件名
 * @param action 回调函数
 */
export const useGlobalEvent = (name: GlobalEventEnum, action: (...args: any) => any) => {
  window.api.on(name, action);
  onBeforeUnmount(() => {
    window.api.off(name, action);
  });
};
