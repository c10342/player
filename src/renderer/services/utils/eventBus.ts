type Fn = (...args: any) => any;

export class EventBus {
  private eventMap: Record<string, Array<Fn>> = {};

  trigger(name: string, ...agrs: any) {
    if (!this.eventMap[name]) {
      return;
    }
    const cbs = this.eventMap[name].slice();
    cbs.forEach((cb) => cb(...agrs));
  }

  on(name: string, action: Fn) {
    if (!this.eventMap[name]) {
      this.eventMap[name] = [];
    }
    const fn = this.eventMap[name].find((f) => f === action);
    if (!fn) {
      this.eventMap[name].push(action);
    }
  }

  off(name: string, action?: Fn) {
    if (!this.eventMap[name]) {
      return;
    }
    if (!action) {
      delete this.eventMap[name];
      return;
    }
    const index = this.eventMap[name].findIndex(
      (fn) => fn === action || (fn as any)._action_ === action
    );
    if (index > -1) {
      this.eventMap[name].splice(index, 1);
    }
  }

  once(name: string, action: Fn) {
    const fn = (...args: any) => {
      action(...args);
      this.off(name, fn);
    };
    fn._action_ = action;
    this.on(name, fn);
  }

  clear() {
    this.eventMap = {};
  }
}
