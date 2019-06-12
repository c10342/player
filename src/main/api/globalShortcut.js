const { globalShortcut, BrowserWindow } = require('electron')

class GlobalShortcut {
    constructor() {
        if(GlobalShortcut.instance){
            return GlobalShortcut.instance
        }
        this.mainWin = BrowserWindow.getFocusedWindow()

        GlobalShortcut.instance = this
    }
    initSpace() {
       
    }

    initEsc() {
        globalShortcut.register('esc', () => {
            this.mainWin.webContents.send('esc')
        })
    }

    initCtrlAndR(){
        globalShortcut.register('ctrl+r',()=>{
            this.mainWin.webContents.send('ctrl+r')
        })
    }

    removeGlobalShortcut(){
        globalShortcut.unregisterAll()
    }

    initGlobalShortcut() {
        this.initSpace()
        this.initEsc()
        this.initCtrlAndR()
    }
}

GlobalShortcut.instance = null

export default GlobalShortcut