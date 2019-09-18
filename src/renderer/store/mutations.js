// 修改音量最内层进度条宽度

export const setInWidth = (state, inWidth)=>{
    state.inWidth = inWidth
}

// 设置音量图标状态
export const setIsVolumeOn = (state,isVolumeOn) =>{
    state.isVolumeOn = isVolumeOn
}

// 设置播放状态
export const setPlaying = (state,isPlaying) =>{
    state.isPlaying = isPlaying
}

// 设置播放速度
export const setSpeed = (state,speed) => {
    state.speed = speed
}

// 设置当前播放视频
export const setCurrentVideo = (state,currentVideo) => {
    state.currentVideo = currentVideo
}

// 设置当前视频索引
export const setCurrentVideoIndex = (state,currentVideoIndex) =>{
    state.currentVideoIndex = currentVideoIndex
}

// 设置当前视频播放列表
export const setVideoList = (state,list) =>{
    if(list instanceof Array){
        state.oldVideoList.push(...list)
        state.videoList.push(...list)
    }else{
        state.oldVideoList.push(list)
        state.videoList.push(list)
    }
}

// 修改播放模式
export const setPlayMode = (state,playMode) =>{
    state.playMode = playMode
}

// 修改排序模式
export const setSortMode = (state,sortMode) => {
    state.sortMode = sortMode
}

// 设置保存播放的视频
export const setOldVideo = (state,oldVideo) => {
    state.oldVideo = oldVideo
}

// 清空播放列表
export const clearVideoList = (state) =>{
    state.videoList = []
    state.oldVideoList = []
}

// 修改播放列表
export const changeList = (state,list) => {
    state.videoList = list
}

// 修改默认排序播放列表
export const changeOldList = (state,list) => {
    state.oldVideoList = list
}

// 设置当前播放进度
export const setCurrentTime = (state,currentTime) => {
    state.currentTime = currentTime
}

// 设置视频总时长
export const setTotalTime = (state,totalTime) => {
    state.totalTime = totalTime
}

// 设置音量百分比
export const setVolumePercent = (state,volumePercent) => {
    state.volumePercent = volumePercent
}

// 设置是否全屏
export const setFullScreen = (state,isFullScreen) => {
    state.isFullScreen = isFullScreen
}

// 设置播放历史记录
export const setHistoricalRecords = (state,historicalRecords) => {
    let history = state.historicalRecords.slice()
    const index = history.findIndex(item=>item.id == historicalRecords.id)
    if(index != -1){
        history.splice(index,1)
    }
    history.unshift(historicalRecords)
    state.historicalRecords = history
}

// 清空播放历史记录
export const clearHistoricalRecords = (state) => {
    state.historicalRecords = []
}

// 设置窗口是否在最前端
export const setAlwaysOnTop = (state,isAlwaysOnTop) =>{
    state.isAlwaysOnTop = isAlwaysOnTop
}

// 设置主题
export const setTheme = (state,theme) =>{
    state.theme = theme
}

// 设置无痕模式
export const setTrace = (state,isTrace) => {
    state.isTrace = isTrace
}