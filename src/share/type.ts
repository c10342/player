import { OpenDialogOptions } from "electron";

export interface OpenDialogParams extends OpenDialogOptions {
  // 模态弹框
  modal?: boolean;
}
