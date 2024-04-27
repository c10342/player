// JsBridge方法调用
export enum BridgeEnum {
  // 设置窗口位置
  SetWinPosition = "setWinPosition",
  // 获取窗口位置
  GetWinPosition = "getWinPosition",
  // 关闭窗口
  CloseWin = "closeWin",
  // 最大化窗口
  MaximizeWin = "maximizeWin",
  // 最小化窗口
  MinimizeWin = "minimizeWin",
  // 还原窗口
  UnmaximizeWin = "unmaximizeWin",
  // 显示窗口
  ShowWin = "showWin",
  // 隐藏窗口
  HideWin = "hideWin",
  // 根据传入的路径选择对应的软件打开
  OpenUrl = "openUrl",
  // 获取软件信息
  GetEnvInfo = "getEnvInfo",
  // 显示一个消息框
  ShowMessageBox = "showMessageBox",
  // 获取相关路径
  GetPath = "getPath",
  // 获取数据
  GetStore = "getStore",
  // 设置数据
  SetStore = "setStore",
  // 显示文件弹框
  ShowOpenDialog = "showOpenDialog",
  // 设置窗口是否点击穿透
  SetIgnoreMouseEvents = "setIgnoreMouseEvents",
  // 设置语言
  SetLang = "setLang",
  // 获取语言
  GetLang = "getLang",
  // 检查更新
  CheckUpdate = "checkUpdate",
  // 安装更新
  InstallUpdate = "installUpdate"
}

// 全局事件广播
export enum GlobalEventEnum {
  // 窗口最大化
  Maximize = "maximize",
  // 窗口最小化
  Minimize = "minimize",
  // 窗口还原
  Unmaximize = "unmaximize",
  // 有版本需要更新
  UpdateAvailable = "update-available",
  // 无需更新
  UpdateNotAvailable = "update-not-available",
  // 下载进度
  DownloadProgress = "download-progress",
  // 下载完成
  UpdateDownloaded = "update-downloaded"
}

// 语言
export enum LangEnum {
  ZhCN = "zh-CN",
  EnUs = "en-US",
  ZhTW = "zh-TW"
}
