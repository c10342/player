import type { IKoffiLib, IKoffiRegisteredCallback, KoffiFunction } from "koffi";

const koffi = require("koffi") as typeof import("koffi");
const path = require("path");

const LockCb = koffi.proto("void* LockCb(void*, void**)");
const UnlockCb = koffi.proto("void UnlockCb(void*, void*, void* const*, uint32)");
const DisplayCb = koffi.proto("void DisplayCb(void*, void*)");

const VlcEventDataTimeChanged = koffi.pack("VlcEventDataTimeChanged", { new_time: "int64" });
const VlcEventDataPositionChanged = koffi.pack("VlcEventDataPositionChanged", {
  new_position: "float"
});
const VlcEventDataLengthChanged = koffi.pack("VlcEventDataLengthChanged", { new_length: "int64" });

const VlcEvent = koffi.struct("VlcEvent", {
  type: "int",
  p_obj: "void *",
  u: koffi.array("char", 16)
});

const UNION_OFFSET = 16;
const VlcEventCb = koffi.proto("void VlcEventCb(VlcEvent*, void*)");

const libvlc_MediaPlayerPlaying = 0x100 + 4;
const libvlc_MediaPlayerPaused = 0x100 + 5;
const libvlc_MediaPlayerStopped = 0x100 + 6;
const libvlc_MediaPlayerEndReached = 0x100 + 9;
const libvlc_MediaPlayerTimeChanged = 0x100 + 11;
const libvlc_MediaPlayerPositionChanged = 0x100 + 12;
const libvlc_MediaPlayerLengthChanged = 0x100 + 17;

export type VlcEventType =
  | "playing"
  | "paused"
  | "stopped"
  | "ended"
  | "frame"
  | "timechanged"
  | "positionchanged"
  | "lengthchanged"
  | "videosize"
  | "destroyed";

export type VlcEventListener = (...args: any[]) => void;

class VlcPlayer {
  private _events: Partial<Record<VlcEventType, VlcEventListener[]>> = {};
  private _videoW = 0;
  private _videoH = 0;
  private _frameBuffer: Buffer;
  private _pendingFrame: Buffer | null = null;
  // vlc实例指针
  private _inst: unknown = null;
  // vlc媒体播放器指针
  private _mp: unknown = null;
  // vlc库指针
  private _libvlc: IKoffiLib | null = null;
  private _sizeCheckTimer: ReturnType<typeof setInterval> | null = null;

  private _lockCb!: IKoffiRegisteredCallback;
  private _unlockCb!: IKoffiRegisteredCallback;
  private _displayCb!: IKoffiRegisteredCallback;
  private _vlcEventCb!: IKoffiRegisteredCallback;
  // libvlc_instance_t* libvlc_new(int argc, const char* const* argv)
  // 创建 LibVLC 实例，传入命令行参数（如 --no-xlib、--verbose=2），返回实例指针，失败返回 NULL
  private _libvlc_new!: KoffiFunction;
  // libvlc_media_player_t* libvlc_media_player_new(libvlc_instance_t* inst);
  // 创建一个空的 VLC 媒体播放器实例，不绑定任何视频
  private _libvlc_media_player_new!: KoffiFunction;
  // libvlc_media_t* libvlc_media_new_path(libvlc_instance_t* inst, const char* path)
  // 从本地文件路径创建媒体。
  private _libvlc_media_new_path!: KoffiFunction;
  // void libvlc_media_player_set_media(libvlc_media_player_t* mp, libvlc_media_t* media)
  // 为播放器绑定 / 切换媒体。
  private _libvlc_media_player_set_media!: KoffiFunction;
  // int libvlc_media_player_play(libvlc_media_player_t* mp)
  // 开始播放，成功返回 0，失败非 0。
  private _libvlc_media_player_play!: KoffiFunction;
  // void libvlc_media_player_pause(libvlc_media_player_t* mp)
  // 暂停播放。
  private _libvlc_media_player_pause!: KoffiFunction;
  // void libvlc_media_release(libvlc_media_t* media)
  // 释放媒体对象。
  private _libvlc_media_release!: KoffiFunction;
  // void libvlc_video_set_callbacks(
  //     libvlc_media_player_t *mp,
  //     libvlc_video_lock_cb lock,
  //     libvlc_video_unlock_cb unlock,
  //     libvlc_video_display_cb display,
  //     void *opaque
  // );
  // LibVLC 最核心的视频帧回调 API，作用：把每一秒的视频原始帧（RGB/BGRA/YUV）抛给你自己的函数处理，不使用 VLC 自带渲染，完全自己绘制画面。
  // 你可以用它做：
  // 自定义渲染（WebGPU/Canvas/OpenGL）
  // 视频帧截图、美颜、滤镜处理
  // 帧数据分析
  // 不依赖窗口句柄播放视频
  // lock：VLC 要写帧数据前，调用你给的函数（申请内存）
  // unlock：VLC 写完一帧，调用你给的函数
  // display：帧准备好，通知你可以渲染了
  // opaque：你自己的自定义数据（会传回给你）
  private _libvlc_video_set_callbacks!: KoffiFunction;
  // void libvlc_video_set_format(
  //   libvlc_media_player_t *mp,
  //   const char *chroma,
  //   unsigned int width,
  //   unsigned int height,
  //   unsigned int pitch
  // );
  // 告诉 LibVLC 你要什么格式、分辨率、每行字节数的视频帧。
  // 必须和 libvlc_video_set_callbacks 一起用，缺一不可。
  private _libvlc_video_set_format!: KoffiFunction;
  // libvlc_time_t libvlc_media_player_get_time(libvlc_media_player_t* mp)
  // 获取当前播放时间（毫秒）。
  private _libvlc_media_player_get_time!: KoffiFunction;
  // libvlc_time_t libvlc_media_player_get_length(libvlc_media_player_t* mp)
  // 获取总时长（毫秒）。
  private _libvlc_media_player_get_length!: KoffiFunction;
  // void libvlc_media_player_set_time(libvlc_media_player_t* mp, libvlc_time_t time)
  // 设置播放时间（毫秒）。
  private _libvlc_media_player_set_time!: KoffiFunction;
  // void libvlc_media_player_set_position(libvlc_media_player_t* mp, float position)
  // 设置播放位置（0-1）。
  // private _libvlc_media_player_set_position!: KoffiFunction;
  // void libvlc_media_player_stop(libvlc_media_player_t* mp)
  // 停止播放。
  private _libvlc_media_player_stop!: KoffiFunction;
  // void libvlc_media_player_release(libvlc_media_player_t* mp)
  // 释放播放器。
  private _libvlc_media_player_release!: KoffiFunction;
  // void libvlc_release(libvlc_instance_t* inst)
  // 释放 LibVLC 实例。
  private _libvlc_release!: KoffiFunction;
  //   int libvlc_video_get_size(
  //     libvlc_media_player_t *p_mi,
  //     unsigned *pi_width,
  //     unsigned *pi_height
  // );
  // 获取正在播放视频的真实分辨率（宽、高）
  // 配合 libvlc_video_set_format 动态设置帧格式
  // 做自适应渲染、窗口大小必须用它
  private _libvlc_video_get_size!: KoffiFunction;
  // libvlc_media_player_event_manager(libvlc_media_player_t* mp)
  // 获取事件管理器，用于注册事件回调。
  private _libvlc_media_player_event_manager!: KoffiFunction;
  // int libvlc_event_attach(libvlc_event_manager_t* em, libvlc_event_type_t event, libvlc_callback_t cb, void* opaque)
  // 绑定事件回调
  private _libvlc_event_attach!: KoffiFunction;
  // bool libvlc_media_player_is_playing(libvlc_media_player_t* mp)
  // 判断是否正在播放。
  private _libvlc_media_player_is_playing!: KoffiFunction;

  constructor() {
    this._frameBuffer = Buffer.alloc(3840 * 2160 * 4);

    this._loadLibVLC();
    this._registerCallbacks();
    this._initVlc();
  }

  on(event: VlcEventType, listener: VlcEventListener): this {
    if (!this._events[event]) {
      this._events[event] = [];
    }
    this._events[event]!.push(listener);
    return this;
  }

  off(event: VlcEventType, listener: VlcEventListener): this {
    if (!this._events[event]) return this;
    this._events[event] = this._events[event]!.filter((fn) => fn !== listener);
    return this;
  }

  private _emit(event: VlcEventType, ...args: unknown[]): void {
    if (!this._events[event]) return;
    for (const fn of this._events[event]!) {
      try {
        fn(...args);
      } catch (e) {
        console.error(`VlcPlayer event handler error [${event}]:`, e);
      }
    }
  }

  // 是否正在播放
  get isPlaying(): boolean {
    if (!this._mp) {
      return false;
    }
    return this._libvlc_media_player_is_playing(this._mp);
  }

  // 当前正在播放的视频总时长（毫秒）
  get duration(): number {
    if (!this._mp) return -1;
    return this._libvlc_media_player_get_length(this._mp) as number;
  }
  // 当前正在播放的视频时间位置（毫秒）
  get currentTime(): number {
    if (!this._mp) return -1;
    return this._libvlc_media_player_get_time(this._mp) as number;
  }

  get videoWidth(): number {
    return this._videoW;
  }

  get videoHeight(): number {
    return this._videoH;
  }

  get pendingFrame(): Buffer | null {
    return this._pendingFrame;
  }

  private _loadLibVLC(): void {
    // __dirname -> E:\project\electron-player\node_modules\electron\dist\resources\electron.asar\renderer
    this._libvlc = koffi.load(path.join(__dirname, "../../../../../../resources/vlc/libvlc.dll"));

    this._libvlc_new = this._libvlc.func("libvlc_new", "void*", ["int", "void*"]);
    this._libvlc_media_player_new = this._libvlc.func("libvlc_media_player_new", "void*", [
      "void*"
    ]);
    this._libvlc_media_new_path = this._libvlc.func("libvlc_media_new_path", "void*", [
      "void*",
      "str"
    ]);
    this._libvlc_media_player_set_media = this._libvlc.func(
      "libvlc_media_player_set_media",
      "void",
      ["void*", "void*"]
    );
    this._libvlc_media_player_play = this._libvlc.func("libvlc_media_player_play", "int", [
      "void*"
    ]);
    this._libvlc_media_player_pause = this._libvlc.func("libvlc_media_player_pause", "void", [
      "void*"
    ]);
    this._libvlc_media_release = this._libvlc.func("libvlc_media_release", "void", ["void*"]);

    this._libvlc_video_set_callbacks = this._libvlc.func("libvlc_video_set_callbacks", "void", [
      "void*",
      koffi.pointer(LockCb),
      koffi.pointer(UnlockCb),
      koffi.pointer(DisplayCb),
      "void*"
    ]);
    this._libvlc_video_set_format = this._libvlc.func("libvlc_video_set_format", "void", [
      "void*",
      "str",
      "uint32",
      "uint32",
      "uint32"
    ]);

    this._libvlc_media_player_get_time = this._libvlc.func(
      "libvlc_media_player_get_time",
      "int64",
      ["void*"]
    );
    this._libvlc_media_player_get_length = this._libvlc.func(
      "libvlc_media_player_get_length",
      "int64",
      ["void*"]
    );
    this._libvlc_media_player_set_time = this._libvlc.func("libvlc_media_player_set_time", "void", [
      "void*",
      "int64"
    ]);
    // this._libvlc_media_player_set_position = this._libvlc.func(
    //   "libvlc_media_player_set_position",
    //   "void",
    //   ["void*", "float"]
    // );
    this._libvlc_media_player_stop = this._libvlc.func("libvlc_media_player_stop", "void", [
      "void*"
    ]);
    this._libvlc_media_player_release = this._libvlc.func("libvlc_media_player_release", "void", [
      "void*"
    ]);
    this._libvlc_release = this._libvlc.func("libvlc_release", "void", ["void*"]);

    this._libvlc_video_get_size = this._libvlc.func("libvlc_video_get_size", "int", [
      "void*",
      "uint32",
      koffi.out(koffi.pointer("uint32")),
      koffi.out(koffi.pointer("uint32"))
    ]);

    this._libvlc_media_player_event_manager = this._libvlc.func(
      "libvlc_media_player_event_manager",
      "void*",
      ["void*"]
    );
    this._libvlc_event_attach = this._libvlc.func("libvlc_event_attach", "int", [
      "void*",
      "int",
      koffi.pointer(VlcEventCb),
      "void*"
    ]);
    this._libvlc_media_player_is_playing = this._libvlc.func(
      "libvlc_media_player_is_playing",
      "bool",
      ["void*"]
    );
  }

  private _initVlc(): void {
    this._inst = this._libvlc_new(0, null);
    this._mp = this._libvlc_media_player_new(this._inst);

    this._videoW = 1920;
    this._videoH = 1080;

    this._libvlc_video_set_format(this._mp, "RV32", this._videoW, this._videoH, this._videoW * 4);
    this._libvlc_video_set_callbacks(this._mp, this._lockCb, this._unlockCb, this._displayCb, null);
    this._attachVlcEvents();
  }

  private _registerCallbacks(): void {
    this._lockCb = koffi.register((_opaque: unknown, planes: unknown) => {
      koffi.encode(planes as object, "void *", this._frameBuffer);
      return null;
    }, koffi.pointer(LockCb));

    this._unlockCb = koffi.register((_opaque: unknown, _picture: unknown, _planes: unknown) => {
      try {
        const size = this._videoW * this._videoH * 4;
        if (size > 0) {
          this._pendingFrame = this._frameBuffer.slice(0, size);
          this._emit("frame", this._pendingFrame, this._videoW, this._videoH);
        }
      } catch (e) {
        console.error("unlockCb error:", e);
      }
    }, koffi.pointer(UnlockCb));

    this._displayCb = koffi.register(() => {}, koffi.pointer(DisplayCb));

    this._vlcEventCb = koffi.register((event: unknown, _opaque: unknown) => {
      try {
        const evt = koffi.decode(event, VlcEvent) as { type: number };
        switch (evt.type) {
          case libvlc_MediaPlayerPlaying:
            setImmediate(() => {
              this._emit("playing");
            });
            break;
          case libvlc_MediaPlayerPaused:
            setImmediate(() => {
              this._emit("paused");
            });
            break;
          case libvlc_MediaPlayerStopped:
            setImmediate(() => {
              // end和stop效果是一样的
              this._emit("stopped");
              this._emit("paused");
              this._emit("timechanged", 0);
              this._emit("positionchanged", 0);
              this._emit("lengthchanged", 0);
            });
            break;
          case libvlc_MediaPlayerEndReached:
            setImmediate(() => {
              this._emit("ended");
              this._emit("paused");
              this._emit("timechanged", 0);
              this._emit("positionchanged", 0);
              this._emit("lengthchanged", 0);
            });
            break;
          case libvlc_MediaPlayerTimeChanged: {
            const data = koffi.decode(event, UNION_OFFSET, VlcEventDataTimeChanged) as {
              new_time: number;
            };
            const t = data.new_time;
            setImmediate(() => {
              if (t >= 0) {
                this._emit("timechanged", t);
              }
            });
            break;
          }
          case libvlc_MediaPlayerPositionChanged: {
            const data = koffi.decode(event, UNION_OFFSET, VlcEventDataPositionChanged) as {
              new_position: number;
            };
            const pos = data.new_position;
            setImmediate(() => {
              if (pos >= 0 && pos <= 1) {
                this._emit("positionchanged", pos);
              }
            });
            break;
          }
          case libvlc_MediaPlayerLengthChanged: {
            const data = koffi.decode(event, UNION_OFFSET, VlcEventDataLengthChanged) as {
              new_length: number;
            };
            const len = data.new_length;
            setImmediate(() => {
              if (len >= 0) {
                this._emit("lengthchanged", len);
              }
            });
            break;
          }
        }
      } catch (e) {
        console.error("vlcEventCb error:", e);
      }
    }, koffi.pointer(VlcEventCb));
  }

  private _attachVlcEvents(): void {
    if (!this._mp) return;
    const em = this._libvlc_media_player_event_manager(this._mp);
    const events = [
      libvlc_MediaPlayerPlaying,
      libvlc_MediaPlayerPaused,
      libvlc_MediaPlayerStopped,
      libvlc_MediaPlayerEndReached,
      libvlc_MediaPlayerTimeChanged,
      libvlc_MediaPlayerPositionChanged,
      libvlc_MediaPlayerLengthChanged
    ];
    for (const type of events) {
      this._libvlc_event_attach(em, type, this._vlcEventCb, null);
    }
  }

  // private _checkVideoSize(): void {
  //   if (!this._mp) return;
  //   const px = [0];
  //   const py = [0];
  //   const ret = this._libvlc_video_get_size(this._mp, 0, px, py) as number;
  //   if (ret === 0 && px[0] > 0 && py[0] > 0) {
  //     this._videoW = px[0];
  //     this._videoH = py[0];
  //     console.log(`[VLC] Video size: ${this._videoW}x${this._videoH}`);
  //     this._libvlc_video_set_format(this._mp, "RV32", this._videoW, this._videoH, this._videoW * 4);
  //     this._emit("videosize", this._videoW, this._videoH);
  //     if (this._sizeCheckTimer) {
  //       clearInterval(this._sizeCheckTimer);
  //       this._sizeCheckTimer = null;
  //     }
  //   }
  // }

  async load(filePath: string) {
    await this.stop();
    const media = this._libvlc_media_new_path(this._inst, filePath);
    this._libvlc_media_player_set_media(this._mp, media);
    this._libvlc_media_player_play(this._mp);
    this._libvlc_media_release(media);

    // if (this._sizeCheckTimer) clearInterval(this._sizeCheckTimer);
    // this._sizeCheckTimer = setInterval(() => this._checkVideoSize(), 100);
  }

  play(): void {
    if (!this.isPlaying && this._mp) {
      this._libvlc_media_player_pause(this._mp);
    }
  }

  pause(): void {
    if (this.isPlaying && this._mp) {
      this._libvlc_media_player_pause(this._mp);
    }
  }

  toggle(): void {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this._mp) {
        resolve();
        return;
      }
      this._libvlc_media_player_stop.async(this._mp, (err: unknown) => {
        if (err) {
          console.error("stop error:", err);
          reject(err);
        } else {
          this._pendingFrame = null;
          this._emit("stopped");
          resolve();
        }
      });
    });
  }

  destroy(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this._mp) {
        resolve();
        return;
      }
      this._libvlc_media_player_stop.async(this._mp, (err: unknown) => {
        if (err) console.error("destroy stop error:", err);
        try {
          this._libvlc_media_player_release(this._mp);
          this._mp = null;
          this._libvlc_release(this._inst);
          this._inst = null;
        } catch (e) {
          console.error("destroy release error:", e);
          reject(e);
          return;
        }
        this._pendingFrame = null;
        this._emit("destroyed");
        resolve();
      });
    });
  }

  // setPosition(position: number): void {
  //   if (this._mp) {
  //     this._libvlc_media_player_set_position(this._mp, position);
  //   }
  // }

  // setTime(time: number): void {
  //   if (this._mp) {
  //     this._libvlc_media_player_set_time(this._mp, time);
  //   }
  // }

  seekTo(time: number): void {
    if (this._mp) {
      this._libvlc_media_player_set_time(this._mp, time);
    }
  }
}

const vlcPlayer = new VlcPlayer();

export default vlcPlayer;
