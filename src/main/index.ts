import { app, BrowserWindow } from "electron";
import { electronApp, optimizer } from "@electron-toolkit/utils";
import { createWindow } from "./services/window";
import { initLog } from "./services/log";
import { initStore } from "./services/store";
import { initBridge } from "./services/bridge";
import { initMonitor } from "./services/monitor";
import { setLang } from "./locale";
import { LangEnum } from "@share/enum";
import { initIoHook } from "./services/iohook";

//   取消警告
//   Render process output: 2-%cElectron Security Warning (Insecure Content-Security-Policy) font-weight: bold; This renderer process has either no Content Security
//   Policy set or a policy with "unsafe-eval" enabled. This exposes users of
//   this app to unnecessary security risks.
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

const closeApp = () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
};

// 初始化应用
const init = async () => {
  // 日志
  initLog();
  // 全局状态
  const store = initStore();
  // JsBridge，渲染进程和主进程的通信桥梁
  initBridge();
  // 错误监控
  initMonitor();
  // 设置语言
  setLang(store.get("lang") as LangEnum);
  // 初始化io监听
  initIoHook();
  // 主窗口
  const mainWin = createWindow({
    minWidth: 900,
    minHeight: 600,
    width: 900,
    height: 600,
    winName: "index",
    autoHideMenuBar: false
  });
  mainWin.on("closed", closeApp);
};

app.whenReady().then(() => {
  electronApp.setAppUserModelId("com.electron");
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  init();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) init();
  });
});

app.on("window-all-closed", closeApp);
