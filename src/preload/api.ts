import { GlobalEventEnum, LangEnum, BridgeEnum } from "@share/enum";
import {
  GetWinPositionRespond,
  SetWinPositionParams,
  OpenUrlParams,
  GetEnvInfoRespond,
  ShowMessageBoxParams,
  ShowMessageBoxRespond,
  GetPathType,
  SetStoreParams,
  ShowOpenDialogParrams,
  SetIgnoreMouseEventsParams,
  StoreState
} from "@share/type";
import { OpenDialogReturnValue, ipcRenderer } from "electron";
import { UpdateCheckResult } from "electron-updater";

const api = {
  // 设置窗口位置
  [BridgeEnum.SetWinPosition](params: SetWinPositionParams) {
    ipcRenderer.send(BridgeEnum.SetWinPosition, params);
  },
  // 获取窗口位置
  [BridgeEnum.GetWinPosition](): Promise<GetWinPositionRespond> {
    return ipcRenderer.invoke(BridgeEnum.GetWinPosition);
  },
  // 最小化窗口
  [BridgeEnum.MinimizeWin]() {
    ipcRenderer.send(BridgeEnum.MinimizeWin);
  },
  //   关闭窗口
  [BridgeEnum.CloseWin]() {
    ipcRenderer.send(BridgeEnum.CloseWin);
  },
  // 最大化窗口
  [BridgeEnum.MaximizeWin]() {
    ipcRenderer.send(BridgeEnum.MaximizeWin);
  },
  // 还原窗口
  [BridgeEnum.UnmaximizeWin]() {
    ipcRenderer.send(BridgeEnum.UnmaximizeWin);
  },
  // 显示窗口
  [BridgeEnum.ShowWin]() {
    ipcRenderer.send(BridgeEnum.ShowWin);
  },
  // 隐藏窗口
  [BridgeEnum.HideWin]() {
    ipcRenderer.send(BridgeEnum.HideWin);
  },
  // 根据Url使用对应的软件打开
  [BridgeEnum.OpenUrl](params: OpenUrlParams) {
    ipcRenderer.send(BridgeEnum.OpenUrl, params);
  },
  // 监听事件
  on(name: GlobalEventEnum, action: (...args: any) => any) {
    ipcRenderer.on(name, action);
  },
  // 移除事件
  off(name: GlobalEventEnum, action: (...args: any) => any) {
    ipcRenderer.removeListener(name, action);
  },
  // 获取软件信息
  [BridgeEnum.GetEnvInfo](): Promise<GetEnvInfoRespond> {
    return ipcRenderer.invoke(BridgeEnum.GetEnvInfo);
  },
  // 显示消息弹框
  [BridgeEnum.ShowMessageBox](params: ShowMessageBoxParams): Promise<ShowMessageBoxRespond> {
    return ipcRenderer.invoke(BridgeEnum.ShowMessageBox, params);
  },
  // 获取相关路径
  [BridgeEnum.GetPath](type: GetPathType): Promise<string> {
    return ipcRenderer.invoke(BridgeEnum.GetPath, type);
  },
  // 获取数据
  [BridgeEnum.GetStore](key: keyof StoreState): Promise<any | null> {
    return ipcRenderer.invoke(BridgeEnum.GetStore, key);
  },
  // 设置数据
  [BridgeEnum.SetStore](params: SetStoreParams) {
    ipcRenderer.send(BridgeEnum.SetStore, params);
  },
  // 打开文件弹框
  [BridgeEnum.ShowOpenDialog](params: ShowOpenDialogParrams): Promise<OpenDialogReturnValue> {
    return ipcRenderer.invoke(BridgeEnum.ShowOpenDialog, params);
  },
  // 设置窗口是否可点击
  [BridgeEnum.SetIgnoreMouseEvents](params: SetIgnoreMouseEventsParams) {
    ipcRenderer.send(BridgeEnum.SetIgnoreMouseEvents, params);
  },
  // 设置语言
  [BridgeEnum.SetLang](lang: LangEnum) {
    ipcRenderer.send(BridgeEnum.SetLang, lang);
  },
  // 获取语言
  [BridgeEnum.GetLang](): Promise<LangEnum> {
    return ipcRenderer.invoke(BridgeEnum.GetLang);
  },
  // 检查更新
  [BridgeEnum.CheckUpdate](): Promise<UpdateCheckResult | null> {
    return ipcRenderer.invoke(BridgeEnum.CheckUpdate);
  },
  // 安装更新
  [BridgeEnum.InstallUpdate]() {
    ipcRenderer.send(BridgeEnum.InstallUpdate);
  }
};

export default api;
