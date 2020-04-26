import storage from "good-storage";

// 仓库
let defaultState = {
  // 音量大小
  inWidth: 31,
  // 是否关闭音量
  isVolumeOn: true,
  // 音量百分比
  volumePercent: 0.5,
  // 当前是否正在播放视频
  isPlaying: false,
  // 视频播放速度
  speed: 1,
  // 保存播放的视频
  oldVideo: null,
  // 当前正在播放的视频
  currentVideo: null,
  // 当前视频的索引
  currentVideoIndex: null,
  // 视频播放列表
  videoList: [],
  // 保存默认排序列表
  oldVideoList: [],
  // 播放模式 1:单个播放,2:单个循环,3:循环播放列表,4:顺序播放,5:随机播放
  playMode: 1,
  // 排序模式 1:默认排序,2:大小排序,3:时间排序,4:随机排序,5:名称排序
  sortMode: 1,
  // 当前视频播放的进度(时间)
  currentTime: 0,
  // 视频总时长
  totalTime: 0,
  // 是否全屏
  isFullScreen: false,
  // 播放的历史记录
  historicalRecords: [],
  // 窗口是否总是在最前端
  isAlwaysOnTop: false,
  // 是否开启无痕模式
  isTrace: false,
  // 主题
  theme: {
    bgUrl: require("../assets/bg1.jpg"),
    textColor: "#ffffff",
    bgColor: "#FAFCFD",
    hover: "theme-hover",
    itemHover: "item-theme-hover",
  },
};

let state = storage.get("state", defaultState);

export default state;
