// JsBridge方法调用
export enum BridgeEnum {
  // 最大化窗口
  MaximizeWindow = "maximizeWindow",
  // 最小化窗口
  MinimizeWindow = "minimizeWindow",
  // 还原窗口
  RestoreWindow = "restoreWindow",
  // 关闭窗口
  CloseWindow = "closeWindow",
  // 打开文件弹框
  OpenDialog = "openDialog",
  // 窗口是否最大化
  IsMaximized = "isMaximized"
}

// 全局事件广播
export enum GlobalEventEnum {
  // 窗口最大化
  MaximizeWindow = "window:maximize",
  // 窗口最小化
  MinimizeWindow = "window:minimize",
  // 窗口还原
  RestoreWindow = "window:unmaximize"
}

// 语言
export enum LocaleEnum {
  ZhCN = "zh-CN",
  ZhTW = "zh-TW",
  En = "en"
}
