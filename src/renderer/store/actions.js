import {
    shuffle
} from '../api/util'

import connect from '../api/bus'

import fs from 'fs'

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

// 删除歌曲
export const deleteVideo = ({
    commit,
    state
}, video) => {
    // 现在的列表
    // 复制一份新的播放列表
    const videoList = state.videoList.slice()
    // 找出传递进来的视频在列表中的索引
    const index = videoList.findIndex(i => i.id == video.id)
    // 删除
    videoList.splice(index, 1)
    commit('changeList', videoList)

    // 原本默认的列表
    // 复制一份新的播放列表
    const oldVideoList = state.oldVideoList.slice()
    // 找出传递进来的视频在列表中的索引
    const oldIndex = oldVideoList.findIndex(i => i.id == video.id)
    // 删除
    oldVideoList.splice(oldIndex, 1)
    commit('changeOldList', oldVideoList)

    // 删除的是当前歌曲
    if (index == state.currentVideoIndex) {
        connect.$emit('deleteCurrentVideo')
        if (videoList.length != 0) {
            commit('setOldVideo', videoList[0])
            commit('setCurrentVideoIndex', 0)
        }else{  //没视频的时候复原状态
            commit('setCurrentVideoIndex', null)
        }
    } else {  //删除视频后，当前视频索引可能会改变
        if (state.oldVideo) {
            const currentIndex = videoList.findIndex(i => i.id == state.oldVideo.id)
            commit('setCurrentVideoIndex', currentIndex)
        }
    }
}


// 清除无效文件
export const clearInvalidVideo = ({
    commit,
    state
}) => {
    // 现在的列表
    let videoList = []
    const vl = state.videoList.slice()
    vl.forEach(element => {
        const result = (fs.existsSync(element.src)) && (element.mode=='local')
        if (result) {
            videoList.push(element)
        }
    });
    commit('changeList', videoList)
    // 删除后视频索引可能会改变
    if (state.oldVideo) {
        const index = videoList.findIndex(item => item.id == state.oldVideo.id)
        commit('setCurrentVideoIndex', index)
    }


    // 原本(默认)的列表
    let oldVideoList = []
    const ovl = state.oldVideoList.slice()
    ovl.forEach(element => {
        const result = (fs.existsSync(element.src)) && (element.mode=='local')
        if (result) {
            oldVideoList.push(element)
        }
    });
    commit('changeOldList', oldVideoList)
}

// 排序模式
export const sortVideoList = ({
    commit,
    state
}, mode) => {
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
    for (var i = 0; i < item1.filename.length; i++) {
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