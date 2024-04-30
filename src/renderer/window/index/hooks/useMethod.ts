import { onBeforeUnmount } from "vue";
import { MethodName } from "../enums/video";
import { Ipc } from "../utils/ipc";

interface MethodMap {
  [MethodName.GetDuration]?: () => number;
  [MethodName.Play]?: () => Promise<void>;
  [MethodName.Pause]?: () => Promise<void>;
  [MethodName.TogglePlay]?: () => Promise<void>;
  [MethodName.Seek]?: (time: number) => void;
  [MethodName.GetCurrentTime]?: () => number;
  [MethodName.SetSpeed]?: (rate: number) => void;
  [MethodName.GetSpeed]?: () => number;
  [MethodName.GetPaused]?: () => boolean;
}

export const ipc = new Ipc();

// 导入全局方法
export const exportMethod = (object: MethodMap) => {
  Object.keys(object).forEach((key) => {
    ipc.handle(key, object[key]);
  });

  onBeforeUnmount(() => {
    Object.keys(object).forEach((key) => {
      ipc.off(key);
    });
  });
};
