import { EventBus } from "@renderer/services/utils/eventBus";
import { Ipc } from "./utils/ipc";
import { AnyFn } from "@share/type";
import { VideoItem } from "./types/video";

// 调度中心
class Player {
  private ipc = new Ipc();

  private eventbus = new EventBus();

  trigger(name: string, ...args: any) {
    this.eventbus.trigger(name, ...args);
    return this;
  }

  on(name: string, action: AnyFn) {
    this.eventbus.on(name, action);
    return this;
  }

  off(name: string, action?: AnyFn) {
    this.eventbus.off(name, action);
    return this;
  }
  once(name: string, action: AnyFn) {
    this.eventbus.once(name, action);
    return this;
  }

  destroy() {
    this.eventbus.clear();
    this.ipc.clear();
  }

  //   注册事件处理函数
  registerHandle(name: string, action: AnyFn) {
    this.ipc.handle(name, action);
    return this;
  }
  removeHandle(name: string) {
    this.ipc.off(name);
    return this;
  }

  async getDuration() {
    const res = await this.ipc.invoke<number>("getDuration");
    return res ?? 0;
  }

  async play() {
    await this.ipc.invoke<void>("play");
  }

  async pause() {
    await this.ipc.invoke<void>("pause");
  }

  async togglePlay() {
    await this.ipc.invoke<void>("togglePlay");
  }

  async seek(time: number) {
    await this.ipc.invoke<void>("seek", time);
  }

  async getCurrentTime() {
    const res = await this.ipc.invoke<number>("getCurrentTime");
    return res ?? 0;
  }

  async setSpeed(rate: number) {
    await this.ipc.invoke<void>("setSpeed", rate);
  }

  async getSpeed() {
    const res = await this.ipc.invoke<number>("getSpeed");
    return res ?? 1;
  }

  async getPaused() {
    const res = await this.ipc.invoke<boolean>("getPaused");
    return res ?? true;
  }

  async setVideo(video: VideoItem | null) {
    await this.ipc.invoke<void>("setVideo", video);
  }
}

export const player = new Player();
