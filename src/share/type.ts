import { MessageBoxOptions, OpenDialogOptions } from "electron";

export interface SetWinPositionParams {
  x: number;
  y: number;
}

export type GetWinPositionRespond = {
  x: number;
  y: number;
} | null;

export interface OpenUrlParams {
  url: string;
}

export interface GetEnvInfoRespond {
  versions: {
    node: string;
    v8: string;
    uv: string;
    zlib: string;
    brotli: string;
    ares: string;
    modules: string;
    nghttp2: string;
    napi: string;
    llhttp: string;
    uvwasi: string;
    acorn: string;
    simdutf: string;
    undici: string;
    openssl: string;
    cldr: string;
    icu: string;
    tz: string;
    unicode: string;
    electron: string;
    chrome: string;
  };
  os: {
    arch: string;
    release: string;
    name: string;
  };
}

export interface ShowMessageBoxParams extends MessageBoxOptions {
  // 参数允许该对话框将自身附加到父窗口, 作为父窗口的模态框
  modal?: boolean;
}

export interface ShowMessageBoxRespond {
  // 点击的按钮的索引。
  response: number;
  // 如果设置了 checkboxLabel，返回复选框是否被选中的状态。 否则，返回 false。
  checkboxChecked: boolean;
}

export type GetPathType =
  | "home"
  | "appData"
  | "userData"
  | "sessionData"
  | "temp"
  | "exe"
  | "module"
  | "desktop"
  | "documents"
  | "downloads"
  | "music"
  | "pictures"
  | "videos"
  | "recent"
  | "logs"
  | "crashDumps";

export interface ShowOpenDialogParrams extends OpenDialogOptions {
  // 模态弹框
  modal?: boolean;
}

export interface SetIgnoreMouseEventsParams {
  ignore: boolean;
  forward?: boolean;
}

export interface SetStoreParams {
  key: keyof StoreState;
  value: any;
}

export interface StoreState {
  lang: string;
}
