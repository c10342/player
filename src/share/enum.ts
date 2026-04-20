// JsBridge方法调用
export enum BridgeEnum {
  MaximizeWindow = "maximizeWindow",
  MinimizeWindow = "minimizeWindow",
  RestoreWindow = "restoreWindow",
  CloseWindow = "closeWindow",
  OpenDialog = "openDialog",
  IsMaximized = "isMaximized",
  SetLocale = "setLocale",
  GetAppVersion = "getAppVersion",
  CheckForUpdate = "checkForUpdate",
  DownloadUpdate = "downloadUpdate",
  InstallUpdate = "installUpdate"
}

// 全局事件广播
export enum GlobalEventEnum {
  MaximizeWindow = "window:maximize",
  MinimizeWindow = "window:minimize",
  RestoreWindow = "window:unmaximize",
  LocaleChanged = "window:localeChanged",
  UpdateAvailable = "update:available",
  UpdateNotAvailable = "update:not-available",
  UpdateDownloadProgress = "update:download-progress",
  UpdateDownloaded = "update:downloaded",
  UpdateError = "update:error"
}

// 语言
export enum LocaleEnum {
  ZhCN = "zh-CN",
  ZhTW = "zh-TW",
  En = "en"
}
