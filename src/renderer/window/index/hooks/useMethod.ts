import { logError } from "@share/log";
import { onBeforeUnmount } from "vue";
import { MethodName } from "../enums/video";

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

const methodMap: MethodMap = {};

// 导入全局方法
export const exportMethod = (object: MethodMap) => {
  Object.keys(object).forEach((key) => {
    if (methodMap[key]) {
      logError(`${key}方法已经存在了`);
      return;
    }
    methodMap[key] = object[key];
  });

  onBeforeUnmount(() => {
    Object.keys(object).forEach((key) => {
      delete methodMap[key];
    });
  });
};

// 导出方法
export const importMethod = () => {
  return { ...methodMap };
};
