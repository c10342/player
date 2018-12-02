import {ipcRenderer} from 'electron'

class WindowUtil {
    // 窗口最小化
    minWindow() {
        // remote.getCurrentWindow().minimize();
        ipcRenderer.send('minimize')
    }

    // 窗口最大化或者还原窗口
    maxWindow() {
        // const browserWindow = remote.getCurrentWindow();
        // if (!isMaxed) {
        //     browserWindow.unmaximize();
        // } else {
        //     browserWindow.maximize();
        // }
        ipcRenderer.send('maximize')
    }

    // 设置窗口是否能改变大小，参数true/false
    setResizable(resizable) {
        // remote.getCurrentWindow().setResizable(resizable);
        ipcRenderer.send('setResizable',resizable)
    }

    // 隐藏窗口
    hide() {
        // const browserWindow = remote.getCurrentWindow();
        // browserWindow.hide();
        ipcRenderer.send('hide')
    }

    // 显示窗口
    show() {
        // const browserWindow = remote.getCurrentWindow();
        // browserWindow.show();
        ipcRenderer.send('show')
    }

    // 设置窗口最前端显示
    setAlwaysOnTop(top) {
        // const browserWindow = remote.getCurrentWindow();
        // browserWindow.setAlwaysOnTop(top);
        ipcRenderer.send('setAlwaysOnTop',top)
    }

    // 关闭窗口
    close() {
        ipcRenderer.send('close')
    }
}

export default  WindowUtil