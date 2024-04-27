import { powerMonitor } from "electron";

type ActionType = (time: number) => any;

let timer: any = null;

// 回调
const cbs: Array<{
  // 原始回调
  action: ActionType;
  // 封装的回调
  fn: ActionType;
}> = [];

const clearTimer = () => {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
};

/**
 * 轮询空闲时间
 * @returns
 */
const pollingIdle = () => {
  if (cbs.length === 0) {
    clearTimer();
    return;
  }
  if (timer) {
    return;
  }
  timer = setTimeout(() => {
    const copyCbs = cbs.slice();
    copyCbs.forEach((f) => f.fn(powerMonitor.getSystemIdleTime()));
    clearTimer();
    pollingIdle();
  }, 1000 * 60);
};

/**
 * 移除回调监听
 * @param action 原始回调
 */
const remove = (action: ActionType) => {
  const index = cbs.findIndex((f) => f.action === action);
  if (index > -1) {
    cbs.splice(index, 1);
  }
  if (cbs.length === 0) {
    clearTimer();
  }
};

/**
 * 监听系统空闲
 * @param action 回调函数
 * @param options time：空闲时间，单位秒
 */
export const watchIdle = (action: ActionType, options?: { time?: number }) => {
  const fn = (time: number) => {
    if (options?.time) {
      if (time >= options.time) {
        action(time);
      }
    } else {
      action(time);
    }
  };
  cbs.push({
    action,
    fn
  });
  pollingIdle();
  return () => remove(action);
};
