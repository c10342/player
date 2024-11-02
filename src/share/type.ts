import { OpenDialogOptions } from "electron";

export interface ShowOpenDialogParrams extends OpenDialogOptions {
  // 模态弹框
  modal?: boolean;
}
