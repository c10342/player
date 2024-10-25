import { isString } from "lodash";
import { isUnDef, logError } from "./services/utils";

class Player {
  // video标签元素
  private videoElement: HTMLVideoElement;

  constructor() {
    this.videoElement = document.createElement("video");
    this.addVideoStyle();
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

  get duration() {
    return this.videoElement.duration;
  }

  get currentTime() {
    return this.videoElement.currentTime;
  }

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

  async src(url: string) {
    this.videoElement.src = url;
  }

  async play() {
    return this.videoElement.play();
  }

  async pause() {
    return this.videoElement.pause();
  }
}

const player = new Player();

export default player;
