// 修改播放列表
export const changeVideoList = ({commit,state},video) => {
    const videoList = state.videoList.slice()
    const index = videoList.findIndex(i=>i.id==video.id)
    videoList[index] = video
    // commit('clearVideoList')
    commit('changeList',videoList)
}