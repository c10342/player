

// 仓库
let state = {
    // 音量大小
    inWidth:30,
    // 是否关闭音量
    isVolumeOn:true,
    // 当前是否正在播放视频
    isPlaying:false,
    // 视频播放速度
    speed:1,
    // 保存播放的视频
    oldVideo:null,
    // 当前正在播放的视频
    currentVideo:null,
    // 当前视频的索引
    currentVideoIndex:null,
    // 视频播放列表
    videoList:[],
    // 播放模式 1:单个播放,2:单个循环,3:循环播放,4:循环循序,5:随机播放
    playMode:1,
    // 排序模式 1:默认排序,2:名称排序
    sortMode:1,
    // 当前视频播放的进度(时间)
    currentTime:0,
    // 视频总时长
    totalTime:0
}


export default state;