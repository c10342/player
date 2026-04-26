// JsBridge方法调用
export enum BridgeEnum {
  MaximizeWindow = "maximizeWindow",
  MinimizeWindow = "minimizeWindow",
  RestoreWindow = "restoreWindow",
  CloseWindow = "closeWindow",
  OpenDialog = "openDialog",
  IsMaximized = "isMaximized",
  SetLang = "setLang",
  GetLang = "getLang",
  GetAppVersion = "getAppVersion",
  CheckForUpdate = "checkForUpdate",
  DownloadUpdate = "downloadUpdate",
  InstallUpdate = "installUpdate",
  TrayPrev = "trayPrev",
  TrayNext = "trayNext",
  TrayTogglePlay = "trayTogglePlay",
  TrayStop = "trayStop",
  SetTrayPlaying = "setTrayPlaying",
  GetStoreValue = "getStoreValue",
  SetStoreValue = "setStoreValue",
  TrayQuit = "trayQuit",
  TrayMenuResize = "trayMenuResize"
}

// 全局事件广播
export enum GlobalEventEnum {
  MaximizeWindow = "window:maximize",
  MinimizeWindow = "window:minimize",
  RestoreWindow = "window:unmaximize",
  LangChanged = "window:langChanged",
  UpdateAvailable = "update:available",
  UpdateNotAvailable = "update:not-available",
  UpdateDownloadProgress = "update:download-progress",
  UpdateDownloaded = "update:downloaded",
  UpdateError = "update:error",
  TrayPlayingChanged = "tray:playingChanged"
}

// 语言
export enum LangEnum {
  ZhCN = "zh-CN",
  ZhTW = "zh-TW",
  En = "en"
}
