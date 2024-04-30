import { onBeforeUnmount } from "vue";
import { Ipc } from "../utils/ipc";

interface MethodMap {
  getDuration?: () => number;
  play?: () => Promise<void>;
  pause?: () => Promise<void>;
  togglePlay?: () => Promise<void>;
  seek?: (time: number) => void;
  getCurrentTime?: () => number;
  setSpeed?: (rate: number) => void;
  getSpeed?: () => number;
  getPaused?: () => boolean;
}

export const ipc = new Ipc();

// 导入全局方法
export const exportMethod = (object: MethodMap) => {
  Object.keys(object).forEach((key) => {
    ipc.handle(key as any, object[key]);
  });

  onBeforeUnmount(() => {
    Object.keys(object).forEach((key) => {
      ipc.off(key);
    });
  });
};
