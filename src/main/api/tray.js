import { Tray, Menu, BrowserWindow,app } from 'electron'

import path from 'path'

function createTray() {
    let win = BrowserWindow.getFocusedWindow();
    // 创建托盘对象
    const iconTray = new Tray(path.join(__dirname,'./static/favicon2.ico'))

    // 托盘右键菜单
    const menu = [
        {
            label: '打开',
            click: () => {
                win.show()
            }
        },
        {
            label: '退出',
            click: () => {
                // 判断是否为mac
                if (process.platform !== 'darwin') {
                    app.quit();
                }
            }
        }
    ]

    const trayMenu = Menu.buildFromTemplate(menu)

    // 设置系统托盘右键菜单
    iconTray.setContextMenu(trayMenu)

    iconTray.setToolTip('音视频播放器')

    win.on('close', (e) => {
        if (win.isFocused()) { //窗口处于失去焦点状态，即最小化到系统托盘
            e.preventDefault(); //阻止窗口的关闭事件
            // 隐藏窗口
            win.hide();
        } else {
            win = null;
        }

    })

    // //监听任务栏图标的点击事件,必须先注册系统托盘右键事件才能显示系统托盘
    iconTray.on('double-click', function () {
        //    显示窗口
        win.show();
    })
}

export default createTray