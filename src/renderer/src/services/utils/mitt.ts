import { FunType } from "@renderer/types";
import { has } from "lodash";

export class Mitt {
  private eventMap: Record<string, Array<FunType>> = {};

  private checkEvent(name: string) {
    if (!has(this.eventMap, name)) {
      this.eventMap[name] = [];
    }
  }

  on(name: string, action: FunType) {
    this.checkEvent(name);
    const index = this.eventMap[name].findIndex((cb) => cb === action);
    if (index === -1) {
      this.eventMap[name].push(action);
    }
    return this;
  }

  once(name: string, action: FunType) {
    this.checkEvent(name);
    const callback: any = (...args: any) => {
      action(...args);
      this.off(name, callback);
    };
    callback.__origin__ = action;
    const index = this.eventMap[name].findIndex((cb) => (cb as any).__origin__ === action);
    if (index === -1) {
      this.eventMap[name].push(callback);
    }
    return this;
  }

  off(name: string, action?: FunType) {
    if (!has(this.eventMap, name)) {
      return this;
    }
    if (!action) {
      delete this.eventMap[name];
      return this;
    }
    const index = this.eventMap[name].findIndex(
      (cb) => (cb as any).__origin__ === action || cb === action
    );
    if (index > -1) {
      this.eventMap[name].splice(index, 1);
    }
    return this;
  }

  emit(name: string, ...args: any) {
    if (!has(this.eventMap, name)) {
      return this;
    }
    const list = this.eventMap[name].slice();
    list.forEach((action) => action(...args));
    return this;
  }

  clear() {
    this.eventMap = {};
    return this;
  }
}
