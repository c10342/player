import {
    shuffle
} from '../api/util'

// 修改播放列表中的某一项
export const changeVideoList = ({
    commit,
    state
}, video) => {
    // 复制一份新的播放列表
    const videoList = state.videoList.slice()
    // 复制一份新的默认排序列表
    const oldVideoList = state.oldVideoList.slice()
    // 找出传递进来的视频在列表中的索引
    const index = videoList.findIndex(i => i.id == video.id)
    const oldIndex = oldVideoList.findIndex(i => i.id == video.id)
    // 修改列表
    videoList[index] = video
    oldVideoList[oldIndex] = video
    commit('changeList', videoList)
    commit('changeOldList', oldVideoList)
}

// 排序模式
export const sortVideoList = ({
    commit,
    state
},mode) => {
    let videoList = state.videoList.slice()
    let oldVideoList = state.oldVideoList.slice()
    switch (mode) {
        // 默认排序
        case 1:
            videoList = oldVideoList
            break;
            // 大小排序
        case 2:
            videoList = videoList.sort((a, b) => a.size - b.size)
            break;
            // 时间排序
        case 3:
            videoList = videoList.sort((a, b) => a.createTime - b.createTime)
            break;
            // 随机排序
        case 4:
            videoList = shuffle(videoList)
            break;
            // 名称排序
        case 5:
            videoList = videoList.sort(compare)
            break;
    }

    commit('changeList', videoList)
    if (state.oldVideo) {
        const index = videoList.findIndex(i => i.id == state.oldVideo.id)
        commit('setCurrentVideoIndex', index)
    }
}

// 排序的规则为：按照第0个字符的大小进行排序，如果第0个字符大小也相同，则按照第1个字符的大小进行排序，以此类推，直至比较出大小；如果两个数字完全相同则顺序不变。
const compare = function (item1, item2) {
    for(var i=0;i<item1.filename.length;i++){
    	 var val1 = item1.filename[i];
         var val2 = item2.filename[i] || '';
	    if (val1 < val2) {
	        return false;
	    } else if (val1 > val2) {
	        return true;
	    }
    } 
    return false;
}