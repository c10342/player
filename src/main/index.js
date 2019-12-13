import { app, BrowserWindow, ipcMain } from 'electron'
import WindowUtil from './api/window'
import OpenDialog from './api/OpenDialog'
// 引入自动更新模块
const { autoUpdater } = require('electron-updater');

const feedUrl = `http://127.0.0.1:5500/win32`; // 更新包位置

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
    // const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
    //     if (mainWindow) {
    //         if (mainWindow.isMinimized()) mainWindow.restore()
    //         mainWindow.focus()
    //     }
    // })


    // 限制只可以打开一个应用, 4.x的文档
    const gotTheLock = app.requestSingleInstanceLock()
    if (!gotTheLock) {
        app.quit()
    } else {
        app.on('second-instance', (event, commandLine, workingDirectory) => {
            // 当运行第二个实例时,将会聚焦到mainWindow这个窗口
            if (mainWindow) {
                if (mainWindow.isMinimized()) mainWindow.restore()
                mainWindow.focus()
                mainWindow.show()
            }
        })
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
    // createTray()

    require('./api/express')


    // 主进程监听渲染进程传来的信息
    ipcMain.on('update', (e, arg) => {
        console.log("update");
        checkForUpdates();
    });

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


let checkForUpdates = () => {
    // 配置安装包远端服务器
    autoUpdater.setFeedURL(feedUrl);

    // 下面是自动更新的整个生命周期所发生的事件
    autoUpdater.on('error', function (message) {
        sendUpdateMessage('error', message);
    });
    autoUpdater.on('checking-for-update', function (message) {
        sendUpdateMessage('checking-for-update', message);
    });
    autoUpdater.on('update-available', function (message) {
        sendUpdateMessage('update-available', message);
    });
    autoUpdater.on('update-not-available', function (message) {
        dialog.showMessageBox({
            type: 'info',
            title: 'update-available',
            message: "发现可用更新"
        })
        sendUpdateMessage('update-not-available', message);
    });

    // 更新下载进度事件
    autoUpdater.on('download-progress', function (progressObj) {
        sendUpdateMessage('downloadProgress', progressObj);
    });
    // 更新下载完成事件
    autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
        sendUpdateMessage('isUpdateNow');
        ipcMain.on('updateNow', (e, arg) => {
            autoUpdater.quitAndInstall();
        });
    });

    //执行自动更新检查
    autoUpdater.checkForUpdates();
};

// 主进程主动发送消息给渲染进程函数
function sendUpdateMessage(message, data) {
    console.log({ message, data });
    mainWindow.webContents.send('message', { message, data });
}

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
