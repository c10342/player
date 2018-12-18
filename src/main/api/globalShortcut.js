const { globalShortcut, BrowserWindow } = require('electron')

class GlobalShortcut {
    constructor() {
        this.mainWin = BrowserWindow.getFocusedWindow()
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

export default GlobalShortcut