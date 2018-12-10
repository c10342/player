// 获取音量最内层进度条的宽度
export const inWidth = state => state.inWidth

// 获取音量图标状态
export const isVolumeOn = state => state.isVolumeOn

// 是否正在播放
export const isPlaying = state => state.isPlaying

// 获取是视频播放速度
export const speed = state => state.speed

// 获取当前正在播放的视频
export const currentVideo = state =>state.currentVideo

// 获取当前视频索引
export const currentVideoIndex = state => state.currentVideoIndex

// 获取视频播放列表
export const videoList = state => state.videoList

// 获取播放模式
export const playMode = state => state.playMode

// 获取排序模式
export const sortMode = state => state.sortMode

// 获取保存播放的视频
export const oldVideo = state => state.oldVideo