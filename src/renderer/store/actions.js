// 修改播放列表
export const changeVideoList = ({commit,state},video) => {
    // const videoList = state.videoList.slice()
    const index = state.videoList.findIndex(i=>i.id==video.id)
    state.videoList[index] = video
    // commit('clearVideoList')
    // commit('setVideoList',videoList)
}