// 窗口
import { shell, BrowserWindow, BrowserWindowConstructorOptions, app } from "electron";
import { join } from "path";
import { is } from "@electron-toolkit/utils";
import { GlobalEventEnum } from "@share/enum";
import icon from "@resources/icon.png?asset";
import { logError, logWarn } from "@share/log";

interface WindowOptions extends BrowserWindowConstructorOptions {
  showReady?: boolean;
  httpUrl?: string;
  fileUrl?: string;
  winName?: string;
}
// 窗口默认配置
const defaultOptions: WindowOptions = {
  width: 1000,
  height: 700,
  show: false,
  autoHideMenuBar: true,
  // ...(process.platform === "linux" ? { icon } : {}),
  icon,
  showReady: true
};

/**
 * 创建窗口
 * @param options WindowOptions
 * @returns
 */
export const createWindow = (options?: WindowOptions) => {
  const config = {
    ...defaultOptions,
    ...(options ?? {})
  };
  const win = new BrowserWindow({
    ...config,
    webPreferences: {
      // 打包后所有代码都在main/index.js一个文件，所以不是../../preload/index.js
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false
    }
  });

  if (!config.show && config.showReady) {
    win.on("ready-to-show", () => {
      win.show();
    });
  }
  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });
  // 监听浏览器错误
  win.webContents.on("console-message", (_event, level, message, line, sourceId) => {
    //  {} 1 log 23 http://localhost:5173/window/index/components/folderItem.vue
    //  {} 1 info 24 http://localhost:5173/window/index/components/folderItem.vue
    //  {} 3 error 25 http://localhost:5173/window/index/components/folderItem.vue
    //  {} 2 warn 26 http://localhost:5173/window/index/components/folderItem.vue
    // 监听异常错误
    // 在浏览器中，如果遇见未知错误或者异常错误，都会在控制台中有输出
    if (level === 3) {
      logError("render-error", message, line, sourceId);
    } else if (level === 2) {
      logWarn("render-warn", message, line, sourceId);
    }
  });
  // 广播窗口事件
  win.on("maximize", () => {
    win.webContents.send(GlobalEventEnum.Maximize);
  });
  win.on("minimize", () => {
    win.webContents.send(GlobalEventEnum.Minimize);
  });
  win.on("unmaximize", () => {
    win.webContents.send(GlobalEventEnum.Unmaximize);
  });
  // 加载窗口内容
  if (options?.httpUrl) {
    // 加载网络地址
    win.loadURL(options.httpUrl);
  } else if (options?.fileUrl) {
    // 加载本地文件
    win.loadFile(options.fileUrl);
  } else if (options?.winName) {
    // 加载项目中的页面，src\renderer\window
    const devIp = process.env["ELECTRON_RENDERER_URL"];
    if (is.dev && devIp) {
      win.loadURL(`${devIp}/window/${options.winName}/index.html`);
    } else {
      win.loadFile(join(__dirname, `../renderer/window/${options.winName}/index.html`));
    }
  }
  return win;
};

/**
 * 阻止打开多个应用程序
 * @param action 回调
 */
export const initSingleApp = (action: (...args: any[]) => any) => {
  const gotTheLock = app.requestSingleInstanceLock();
  if (!gotTheLock) {
    app.quit();
  } else {
    app.on("second-instance", action);
  }
};
