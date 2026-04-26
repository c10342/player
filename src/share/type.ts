import { OpenDialogOptions } from "electron";

export interface OpenDialogParams extends OpenDialogOptions {
  modal?: boolean;
}

// 播放列表
export interface PlayerListItem {
  // 视频名称
  name: string;
  // 视频路径
  path: string;
  // 视频类型
  type: string;
  // 视频大小
  size: number;
  // 错误信息
  error: string;
}
