// 参考ipcrender和ipcmain

import { logError } from "@share/log";

interface HandlerItem {
  [key: string]: (...args: any) => any;
}

export class Ipc {
  private actionMap: HandlerItem = {};
  // 处理函数
  handle(name: string, action: (...args) => any) {
    if (this.actionMap[name]) {
      logError(`${name}已经存在了`);
      return;
    }
    this.actionMap[name] = action;
  }
  // 使用
  async invoke<T = any>(name: string, ...args: any) {
    const cb = this.actionMap[name];
    const res = await cb?.(...args);
    return res as T | null;
  }
  // 移除
  off(name: string) {
    delete this.actionMap[name];
  }
}
