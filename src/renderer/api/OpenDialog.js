import { ipcRenderer } from 'electron'

const fs = require('fs')

const path = require('path')

import store from '../store'

class OpenDialog {
    constructor() {
        this.onOpenFile()
    }
    openFile() {
        // 同步通讯
        // 向主进程发送消息并等待回复
        // const path = ipcRenderer.sendSync('openFile')
        // if(!path){
        //     return
        // }
        // // 获取文件信息
        // const arr = this.getFileStat(path)
        // if(arr.length == 0){
        //     return
        // }
        // // 第一次添加，即播放列表没有数据
        // if(store.state.videoList.length == 0){
        //     store.commit('setCurrentVideo',arr[0])
        //     store.commit('setOldVideo',arr[0])
        //     store.commit('setCurrentVideoIndex',0)
        // }
        // store.commit('setVideoList',arr)

        // 异步通讯
        ipcRenderer.send('openFile')
    }
    onOpenFile() {
        ipcRenderer.on('openFile-ok', (e, path) => {
            if (!path) {
                return
            }
            // 获取文件信息
            const arr = this.getFileStat(path)
            if (arr.length == 0) {
                return
            }
            // 第一次添加，即播放列表没有数据
            if (store.state.videoList.length == 0) {
                store.commit('setCurrentVideo', arr[0])
                store.commit('setOldVideo', arr[0])
                store.commit('setCurrentVideoIndex', 0)
            }
            store.commit('setVideoList', arr)
        })
    }
    getFileStat(path) {
        let arr = []
        for (let i = 0; i < path.length; i++) {
            const result = fs.statSync(path[i])
            const index = store.state.videoList.findIndex(j => j.src == path[i])
            if (result && result.dev && index < 0) {
                let obj = Object.assign({}, result, { src: path[i] })
                arr.push(this.formatData(obj))
            }
        }
        return arr
    }
    formatData(data) {
        const result = fs.existsSync(data.src)
        return {
            id: (+new Date()) + Math.random(),
            // 创建时间
            createTime: +new Date(data.birthtime),
            // 视频大小
            size: data.size,
            // 视频是否播放状态
            isPlaying: false,
            // 播放进度
            currentTime: 0,
            // 视频是本地文件还是网络文件
            mode: 'local',
            // 视频播放倍速
            speed: 1,
            // 视频总时间
            totalTime: 0,
            // 视频路径
            src: data.src,
            // 文件名,
            filename: path.basename(data.src),
            // 文件是否有效
            msg: result ? '' : '无效文件'
        }
    }
}

export default OpenDialog