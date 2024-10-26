import { isNumber } from "lodash";
import { Mitt } from "./services/utils";
import { FunType } from "./types";

// video标签事件
const videoEvent = {
  abort: "abort",
  canplay: "canplay",
  canplaythrough: "canplaythrough",
  durationchange: "durationchange",
  emptied: "emptied",
  ended: "ended",
  error: "error",
  loadeddata: "loadeddata",
  loadedmetadata: "loadedmetadata",
  loadstart: "loadstart",
  pause: "pause",
  play: "play",
  playing: "playing",
  progress: "progress",
  ratechange: "ratechange",
  seeked: "seeked",
  seeking: "seeking",
  stalled: "stalled",
  suspend: "suspend",
  timeupdate: "timeupdate",
  volumechange: "volumechange",
  waiting: "waiting",
  enterpictureinpicture: "enterpictureinpicture",
  leavepictureinpicture: "leavepictureinpicture"
};

// 自定义播放事件
const customEvent = {
  // 画面渲染
  render: "render"
};

// 播放器事件
export const playerEvent = {
  // video标签事件
  ...videoEvent,
  ...customEvent
};

class Player {
  // video标签元素
  private videoElement: HTMLVideoElement;
  //   发布/订阅
  private emitter = new Mitt();

  constructor() {
    this.videoElement = document.createElement("video");
    this.addVideoStyle();
    this.addVideoAttr();
    this.addVideoEvent();
  }

  //   vdeo标签样式
  private addVideoStyle() {
    const style: Partial<CSSStyleDeclaration> = {
      width: "100%",
      height: "100%"
    };
    Object.keys(style).forEach((key) => {
      this.videoElement.style[key] = style[key];
    });
  }

  //   监听播放器事件
  private addVideoEvent() {
    Object.values(videoEvent).forEach((name) => {
      this.videoElement.addEventListener(name, (...args: any) => {
        this.emit(name, ...args);
      });
    });
  }

  // 添加video标签属性
  private addVideoAttr() {
    const attrs = {
      preload: "auto",
      crossorigin: "anonymous"
    };
    Object.keys(attrs).forEach((key) => {
      this.videoElement.setAttribute(key, attrs[key]);
    });
  }

  //   视频总时长
  get duration() {
    return this.videoElement.duration;
  }

  //   当前播放进度
  get currentTime() {
    return this.videoElement.currentTime;
  }

  //   视频状态：暂停
  get isPaused() {
    return this.videoElement.paused;
  }

  //   视频状态：播放
  get isPlaying() {
    return !this.videoElement.paused;
  }

  // 视频宽
  get videoWidth() {
    return this.videoElement.videoWidth;
  }
  // 视频高
  get videoHeight() {
    return this.videoElement.videoHeight;
  }

  get videoEl() {
    return this.videoElement;
  }

  async init() {
    let handle: number | null = null;
    // 使用requestAnimationFrame定时器实现canvas绘制video每一帧
    const videoRender = () => {
      if (this.isPlaying) {
        handle = window.requestAnimationFrame(videoRender);
        this.emit(playerEvent.render, this.videoElement);
      }
    };
    this.on(playerEvent.play, videoRender);
    this.on(playerEvent.pause, () => {
      if (isNumber(handle)) {
        window.cancelAnimationFrame(handle);
      }
    });
  }

  // 监听事件
  on(name: string, action: FunType) {
    this.emitter.on(name, action);
    return this;
  }
  // 监听事件，只触发一次
  once(name: string, action: FunType) {
    this.emitter.once(name, action);
    return this;
  }
  // 移除事件监听
  off(name: string, action?: FunType) {
    this.emitter.off(name, action);
    return this;
  }
  // 触发事件
  emit(name: string, ...args: any) {
    this.emitter.emit(name, ...args);
    return this;
  }

  // 播放视频
  async src(url: string) {
    this.videoElement.src = url;
  }
  // 播放
  async play() {
    return this.videoElement.play();
  }
  // 暂停
  async pause() {
    return this.videoElement.pause();
  }
  // 切换播放/暂停
  async toggle() {
    if (this.isPaused) {
      return this.play();
    }
    return this.pause();
  }
}

const player = new Player();

export default player;
