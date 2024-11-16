import { isNumber } from "lodash";
import { Mitt, sleep } from "./services/utils";
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
  render: "render",
  // 视频切换
  switchVideo: "switchVideo"
};

// 播放器事件
export const playerEvent = {
  // video标签事件
  ...videoEvent,
  ...customEvent
};

// 表示音频/视频元素的就绪状态
// 0 = HAVE_NOTHING - 没有关于音频/视频是否就绪的信息
// 1 = HAVE_METADATA - 关于音频/视频就绪的元数据
// 2 = HAVE_CURRENT_DATA - 关于当前播放位置的数据是可用的，但没有足够的数据来播放下一帧/毫秒
// 3 = HAVE_FUTURE_DATA - 当前及至少下一帧的数据是可用的
// 4 = HAVE_ENOUGH_DATA - 可用数据足以开始播放
export enum VideoReadyStateEnum {
  Nothing = 0,
  Metadata = 1,
  CurrentData = 2,
  FutureData = 3,
  EnoughData = 4
}

class Player {
  // video标签元素
  videoElement: HTMLVideoElement;
  //   发布/订阅
  private emitter = new Mitt();

  // 当前正在播放的地址
  currentUrl = "";

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
    return this.videoElement.duration || 0;
  }

  //   当前播放进度
  get currentTime() {
    return this.videoElement.currentTime || 0;
  }

  //   视频状态：暂停
  get isPaused() {
    return this.videoElement.paused ?? true;
  }

  //   视频状态：播放
  get isPlay() {
    return !this.isPaused;
  }

  // 视频宽
  get videoWidth() {
    return this.videoElement.videoWidth || 0;
  }
  // 视频高
  get videoHeight() {
    return this.videoElement.videoHeight || 0;
  }

  // 视频状态
  get readyState() {
    return this.videoElement.readyState || 0;
  }

  // 视频是否已经准备好了
  get isReady() {
    return this.readyState !== VideoReadyStateEnum.Nothing;
  }

  async init() {
    let handle: number | null = null;
    // 使用requestAnimationFrame定时器实现canvas绘制video每一帧
    const videoRender = () => {
      if (this.isPlay) {
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
    // 先暂停在切换视频
    await this.pause();
    await sleep();
    this.currentUrl = url;
    this.videoElement.src = url;
    this.emit(playerEvent.switchVideo, url);
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
  // 跳转到指定播放位置
  async seekTo(time: number) {
    this.videoElement.currentTime = time;
  }
  // 静音
  async muted() {
    this.videoElement.muted = true;
  }
}

const player = new Player();

export default player;
