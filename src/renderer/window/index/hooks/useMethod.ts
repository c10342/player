import { AnyFn } from "@share/type";
import { onBeforeUnmount } from "vue";
import { player } from "../player";

// 导入全局方法
export const exportMethod = (object: Record<string, AnyFn>) => {
  Object.keys(object).forEach((key) => {
    player.registerHandle(key as any, object[key]);
  });

  onBeforeUnmount(() => {
    Object.keys(object).forEach((key) => {
      player.removeHandle(key);
    });
  });
};
