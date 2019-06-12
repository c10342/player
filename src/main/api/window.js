import {ipcMain,BrowserWindow} from 'electron'

class WindowUtil{
    constructor(){
        if(WindowUtil.instance){
            return WindowUtil.instance
        }
        this.mainWin = BrowserWindow.getFocusedWindow()
        WindowUtil.instance = this
    }
    // 最小化窗口
    minWindow(){
        ipcMain.on('minimize',()=>{
            this.mainWin.minimize()
        })
    }
    // 最大化窗口
    maxWindow(){
        ipcMain.on('maximize',()=>{
            // 判断是否已经是最大化了
            if(this.mainWin.isMaximized()){
                // 重置窗口大小
                this.mainWin.restore()
            }else{
                // 最大化窗口
                this.mainWin.maximize()
            }
        })
    }
    // 是否允许缩放窗口
    setResizable(){
        ipcMain.on('setResizable',(e,resizable)=>{
            this.mainWin.setResizable(resizable)
        })
    }

    // 把窗口设置为在最前端显示
    setAlwaysOnTop(){
        ipcMain.on('setAlwaysOnTop',(e,top)=>{
            this.mainWin.setAlwaysOnTop(top)
        })
    }

    // 设置窗口是否为全屏
    setFullScreen(){
        ipcMain.on('setFullScreen',(e,isFullScreen)=>{
            this.mainWin.setFullScreen(isFullScreen)
        })
    }

    // 关闭窗口
    close(){
        ipcMain.on('close',()=>{
            this.mainWin.close()
        })
    }

    // 初始化窗口
    initWin(){
        this.minWindow()
        this.maxWindow()
        this.close()
        this.setAlwaysOnTop(false)
        this.setResizable(true)
        this.setFullScreen()
    }
}

WindowUtil.instance = null

export default WindowUtil