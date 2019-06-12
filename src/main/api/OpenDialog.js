import {
    ipcMain,
    dialog
} from 'electron'

const fs = require('fs')

const MyPath = require('path')


class OpenDialog {
    constructor(){
        if(OpenDialog.instance){
            return OpenDialog.instance
        }
        this.count= 0
        OpenDialog.instance = this
    }
    init() {
        this.openFile()
        this.openFolder()
        this.reg = /\.(MP4|WebM|Ogg|mkv|avi|MOV|ASF|WMV|NAVI|3GP|FLV|F4V|RMVB|HDDVD|rm|rmvb|mp3)$/i
    }
    // 打开文件
    openFile() {
        // 异步通讯
        ipcMain.on('openFile', (e) => {
            dialog.showOpenDialog({
                title: '打开文件',
                defaultPath: 'xxx',
                properties: ['openFile', 'multiSelections'],
                filters: [{
                    name: 'video',
                    extensions: ['MP4', 'WebM', 'Ogg', 'mkv', 'avi', 'MOV', 'ASF', 'WMV', 'NAVI', '3GP', 'FLV', 'F4V', 'RMVB', 'HDDVD', 'rm', 'rmvb','MP3']
                }]
            }, (path) => {
                if (!path) {
                    return
                }
                e.sender.send('openFile-ok', path)
            })
        })
    }
    // 打开文件夹
    openFolder() {
        ipcMain.on('openFolder', (e) => {
            dialog.showOpenDialog({
                title: '打开文件夹',
                properties: ['openDirectory', 'multiSelections']
            }, (path) => {
                if (!path) {
                    return
                }
                const result = this.readFileFromFolder(path)
                this.count = 0
                e.sender.send('openFolder-ok', result)
            })
        })
    }

    // 从文件夹中读取文件
    readFileFromFolder(path) {
        this.count++
        if(this.count>3){
            return []
        }
        let arr = []
        for (let i = 0; i < path.length; i++) {
            const p = path[i];
            const stat = fs.statSync(p)
            if (stat.isDirectory() == true) {
                let result = fs.readdirSync(p)
                for (let j = 0; j < result.length; j++) {
                    result[j] = MyPath.join(p, result[j])
                }
                arr.push(...this.readFileFromFolder(result))
            } else {
                if (this.reg.test(p) && fs.existsSync(p)) {
                    arr.push(p)
                }
            }
        }
        return arr
    }
}

OpenDialog.instance = null

export default OpenDialog