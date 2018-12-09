import {ipcRenderer} from 'electron'

const fs = require('fs')

const path = require('path')

import store from '../store'

class OpenDialog{
    openFile(){
        const path = ipcRenderer.sendSync('openFile')
        if(!path){
            return
        }
        const arr = this.getFileStat(path)
        if(store.state.videoList.length == 0){
            store.commit('setCurrentVideo',arr[0])
            store.commit('setOldVideo',arr[0])
            store.commit('setCurrentVideoIndex',0)
        }
        store.commit('setVideoList',arr)
    }
    getFileStat(path){
        let arr = []
        for(let i=0;i<path.length;i++){
            const result = fs.statSync(path[i])
            const index = store.state.videoList.findIndex(i=>i.id==result.ino)
            if(result && result.dev && index<0){
                let obj = Object.assign({},result,{src:path[i]})
                arr.push(this.formatData(obj))
            }
        }
        return arr
    }
    formatData(data){
        return {
            id:(+new Date())+Math.random(),
            // 创建时间
            createTime:data.birthtime,
            // 视频大小
            size:data.size,
            // 视频是否播放状态
            isPlaying:false,
            // 播放进度
            currentTime:0,
            // 视频是本地文件还是网络文件
            mode:'local',
            // 视频播放倍速
            speed:1,
            // 视频总时间
            totalTime:0,
            // 视频路径
            src:data.src,
            // 文件名,
            filename:path.basename(data.src)
        }
    }
}

export default OpenDialog