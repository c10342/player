// 修改音量最内层进度条宽度
// import {speed} from "./getters";

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
        state.videoList.push(...list)
    }else{
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
}

// 修改播放列表
export const changeList = (state,list) => {
    state.videoList = list
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