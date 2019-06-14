import { app, BrowserWindow } from 'electron'
import WindowUtil from './api/window'
import OpenDialog from './api/OpenDialog'
import createTray from './api/tray'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`

function createWindow() {
    /**
     * Initial window options
     */
    mainWindow = new BrowserWindow({
        height: 589,
        useContentSize: true,
        width: 866,
        minWidth: 760,
        minHeight: 550,
        webPreferences: {
            webSecurity: false
        },
        // 初始化时的背景颜色
        backgroundColor: '#2e2c29',
        frame: false //关闭最大化那一栏
    })

    mainWindow.loadURL(winURL)

    mainWindow.on('close', () => {
        mainWindow.webContents.send('close')
    })
    // 因为强制关机或机器重启或会话注销而导致窗口会话结束时触发
    mainWindow.on('session-end', () => {
        mainWindow.webContents.send('close')
    })
    mainWindow.on('closed', () => {
        mainWindow = null
    })

    // 只能开启一个应用窗口
    const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore()
            mainWindow.focus()
        }
    })

    if (shouldQuit) {
        app.quit()
    }

    // 隐藏菜单栏
    mainWindow.setMenu(null)

    const winUtil = new WindowUtil()
    // 初始化窗口状态
    winUtil.initWin()

    // 打开文件
    const openDialog = new OpenDialog();
    openDialog.init()

    // 初始化系统托盘
    createTray()

    require('./api/express')

}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
