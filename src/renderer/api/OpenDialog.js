import {
    ipcRenderer
} from 'electron'

const fs = require('fs')

const path = require('path')

import store from '../store'

class OpenDialog {
    constructor() {
        // 单例模式
        if (OpenDialog.instance) {
            return OpenDialog.instance
        }
        this.onOpenFile()
        this.onOpenFolder()
        OpenDialog.instance = this
    }
    // 打开文件
    openFile() {
        // 异步通讯
        ipcRenderer.send('openFile')
    }
    // 打开文件夹
    openFolder() {
        ipcRenderer.send('openFolder')
    }
    // 监听主进程在打开文件后返回的数据
    onOpenFile() {
        ipcRenderer.on('openFile-ok', (e, path) => {
            if (!path) {
                return
            }
            // 获取文件信息
            const arr = this.getFileStatFromLocal(path)
            if (arr.length == 0) {
                return
            }
            this.changeStore(arr)
        })
    }
    // 监听主进程在打开文件夹后返回的数据
    onOpenFolder() {
        ipcRenderer.on('openFolder-ok', (e, path) => {
            if (!path) {
                return
            }
            // 获取文件信息
            const arr = this.getFileStatFromLocal(path)
            if (arr.length == 0) {
                return
            }
            this.changeStore(arr)
        })
    }
    // 打开url
    openUrl(path) {
        // 获取文件信息
        const arr = this.getFileStatFromUrl(path)
        if (arr.length == 0) {
            return
        }
        this.changeStore(arr)
    }
    // 修改store
    changeStore(arr) {
        // 第一次添加，即播放列表没有数据
        if (store.state.videoList.length == 0) {
            store.commit('setCurrentVideo', arr[0])
            store.commit('setOldVideo', arr[0])
            store.commit('setCurrentVideoIndex', 0)
        }
        store.commit('setVideoList', arr)
    }
    // 获取本地文件的信息
    getFileStatFromLocal(path) {
        let arr = []
        for (let i = 0; i < path.length; i++) {
            const result = fs.statSync(path[i])
            const index = store.state.videoList.findIndex(j => j.src == path[i])
            if (result && result.dev && index < 0) {
                let obj = Object.assign({}, result, {
                    src: path[i],
                    mode: 'local'
                })
                arr.push(this.formatData(obj))
            }
        }
        return arr
    }
    // 获取url文件信息
    getFileStatFromUrl(path) {
        let arr = []
        let obj = {
            src: path,
            birthtime: +new Date,
            size: 1,
            mode: 'url'
        }
        arr.push(this.formatData(obj))
        return arr
    }
    formatData(data) {
        let result = true
        if (data.mode == 'local') {
            result = fs.existsSync(data.src)
        }
        return {
            id: data.src,
            // 创建时间
            createTime: +new Date(data.birthtime),
            // 视频大小
            size: data.size,
            // 视频是否播放状态
            isPlaying: false,
            // 播放进度
            currentTime: 0,
            // 视频是本地文件还是网络文件，local本地文件，url网络文件
            mode: data.mode,
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

OpenDialog.instance = null

export default OpenDialog