import { isString } from "lodash";
import { isUnDef, logError, Mitt } from "./services/utils";
import { FunType } from "./types";

class Player {
  // 播放器事件
  static events = {
    // video标签事件
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

  // video标签元素
  private videoElement: HTMLVideoElement;
  //   发布/订阅
  private emitter = new Mitt();

  constructor() {
    this.videoElement = document.createElement("video");
    this.addVideoStyle();
    this.addVideoEvent();
  }

  //   vdeo标签样式
  private addVideoStyle() {
    const style: Partial<CSSStyleDeclaration> = {
      width: "100%",
      height: "100%",
      position: "absolute",
      top: "0px",
      left: "0px"
    };
    Object.keys(style).forEach((key) => {
      this.videoElement.style[key] = style[key];
    });
  }

  //   监听播放器事件
  private addVideoEvent() {
    Object.values(Player.events).forEach((name) => {
      this.videoElement.addEventListener(name, (...args: any) => {
        this.emitter.emit(name, ...args);
      });
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

  // 初始化
  async init(options: { el: string | HTMLElement }) {
    let container = options.el as HTMLElement | null;
    if (isString(options.el)) {
      container = document.querySelector(options.el);
    }
    if (isUnDef(container)) {
      logError("el is not defind");
      return;
    }
    // 添加进容器，显示视频
    container.appendChild(this.videoElement);
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
